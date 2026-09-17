import {
  addDays,
  format,
  isSameDay,
  endOfWeek,
  endOfMonth,
  startOfMonth,
  startOfWeek,
  isSunday,
  isSaturday,
  isWithinInterval,
  startOfDay,
  endOfDay,
} from "date-fns";
import {
  ScheduleEvent,
  EventLayout,
  holidayType,
  EventCategory,
  ScheduleApiRequest,
  ScheduleApiResponse,
} from "../types/schedule";
import { getTimes } from "./time";

const toScheduleEvent = (res: ScheduleApiResponse): ScheduleEvent => {
  const startTime = res.startTime ?? "00:00:00";
  const endTime = res.endTime ?? startTime;
  const endDate = res.endDate ?? res.startDate;

  return {
    id: res.id,
    title: res.title,
    author: res.author,
    content: res.content,
    createdAt: res.createdAt,
    createdBy: res.createdBy ?? res.author?.memberNo,
    category: (res.category as EventCategory) || "personal",
    startDate: `${res.startDate}T${startTime}`,
    endDate: `${endDate}T${endTime}`,
    participantMemberNos: (res.participants ?? []).map((p) => p.memberNo),
  };
};

const toScheduleRequest = (payload: {
  title: string;
  content?: string;
  category: string;
  startDate: string;
  endDate: string;
  participantMemberNos?: number[];
}): ScheduleApiRequest => {
  const [startDatePart, startTimePart] = payload.startDate.split("T");
  const [endDatePart, endTimePart] = payload.endDate.split("T");

  return {
    title: payload.title,
    category: payload.category,
    content: payload.content,
    startDate: startDatePart,
    endDate: endDatePart,
    startTime: startTimePart,
    endTime: endTimePart,
    participantMemberNos: payload.participantMemberNos,
  };
};

const getWeekDates = (currentDate: Date) => {
  const start = startOfWeek(currentDate, { weekStartsOn: 0 });
  return Array.from({ length: 7 }, (_, i) => addDays(start, i));
};

const isSameDate = (dateA: string | Date, dateB: Date | undefined) => {
  if (!dateB) return false;
  return isSameDay(new Date(dateA), dateB);
};

const getEventPosition = (
  displayStart: Date,
  displayEnd: Date,
  currentDate: Date,
) => {
  const dayStart = startOfDay(currentDate);
  const totalMinutes =
    (displayStart.getTime() - dayStart.getTime()) / (1000 * 60);
  const duration =
    (displayEnd.getTime() - displayStart.getTime()) / (1000 * 60);

  const top = Math.min(Math.max((totalMinutes / 1440) * 100, 0), 100);
  const MIN_DURATION_MINUTES = 30;
  const height = Math.max(
    (duration / 1440) * 100,
    (MIN_DURATION_MINUTES / 1440) * 100,
  );

  return { top, height };
};

const getMonthDates = (currentDate: Date) => {
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const gridStart = startOfWeek(monthStart, { weekStartsOn: 0 });
  const gridEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });

  const dates: Date[] = [];
  let day = gridStart;
  while (day <= gridEnd) {
    dates.push(day);
    day = addDays(day, 1);
  }
  return dates;
};

const findHoliday = (date: Date, holidays: holidayType[] | holidayType) => {
  if (!holidays) return undefined;

  const holidayList = Array.isArray(holidays) ? holidays : [holidays];

  const targetDateStr = format(date, "yyyy-MM-dd");

  return holidayList.find((h) => {
    const s = h.locdate?.toString();
    const hDateStr = `${s?.substring(0, 4)}-${s?.substring(4, 6)}-${s?.substring(6, 8)}`;

    return targetDateStr === hDateStr;
  });
};

const getDayColor = (date: Date, isHoliday: holidayType | undefined) => {
  if (isHoliday) return "text-error-500 font-semibold";
  if (isSunday(date)) return "text-error-500";
  if (isSaturday(date)) return "text-blue";
  return "text-muted";
};

export type WeatherKind =
  "rain" | "sleet" | "snow" | "shower" | "sun" | "partly" | "cloud";

/** 기상청 단기예보의 강수형태(PTY)·하늘상태(SKY) 코드를 아이콘 종류로 바꾼다. */
export const getWeatherKind = (
  pty: string,
  sky: string,
): WeatherKind | null => {
  const rain: Record<string, WeatherKind> = {
    "1": "rain",
    "2": "sleet",
    "3": "snow",
    "4": "shower",
  };

  if (pty !== "0") return rain[pty] ?? null;

  const skyKinds: Record<string, WeatherKind> = {
    "1": "sun",
    "3": "partly",
    "4": "cloud",
  };

  return skyKinds[sky] ?? null;
};

const getmonthTime = (startStr: string, endStr: string, date: Date) => {
  const start = new Date(startStr);
  const end = new Date(endStr);
  const isMultiDay = !isSameDate(start, end);

  if (!isMultiDay) {
    return `${getTimes(startStr)} - ${getTimes(endStr)}`;
  }

  if (isSameDate(start, date)) return `${getTimes(startStr)} ~ 끝`;
  if (isSameDate(end, date)) return `시작 ~ ${getTimes(endStr)}`;
  return `진행 중`;
};

const canEditSchedule = ({
  createdBy,
  myMemberNo,
  myGroupRole,
}: {
  createdBy?: number;
  myMemberNo?: number;
  myGroupRole?: "SUPER" | "SUB" | "MEMBER";
}): boolean => {
  if (myGroupRole === "SUPER" || myGroupRole === "SUB") return true;

  if (createdBy === undefined || myMemberNo === undefined) return true;

  return createdBy === myMemberNo;
};

const isOverlapping = (a: EventLayout, b: EventLayout) =>
  a.top < b.top + b.height && a.top + a.height > b.top;

const applyLayout = (
  events: EventLayout[],
  maxVisibleColumns = 3,
): EventLayout[] => {
  if (events.length === 0) return events;

  const sorted = [...events].sort((a, b) => a.top - b.top);

  const clusters: EventLayout[][] = [];
  let current: EventLayout[] = [];
  let clusterEnd = -Infinity;

  sorted.forEach((event) => {
    if (current.length > 0 && event.top >= clusterEnd) {
      clusters.push(current);
      current = [];
      clusterEnd = -Infinity;
    }

    current.push(event);
    clusterEnd = Math.max(clusterEnd, event.top + event.height);
  });

  if (current.length > 0) clusters.push(current);

  const MAX_VISIBLE_COLUMNS = maxVisibleColumns;

  const result: EventLayout[] = [];

  clusters.forEach((cluster) => {
    const columns: EventLayout[][] = [];

    cluster.forEach((event) => {
      const column = columns.find(
        (col) => !isOverlapping(col[col.length - 1], event),
      );

      if (column) {
        column.push(event);
      } else {
        columns.push([event]);
      }
    });

    if (columns.length <= MAX_VISIBLE_COLUMNS) {
      const width = 100 / columns.length;

      columns.forEach((column, columnIndex) => {
        column.forEach((event) => {
          result.push({ ...event, width, left: width * columnIndex });
        });
      });
      return;
    }

    const width = 100 / MAX_VISIBLE_COLUMNS;
    const visibleColumns = columns.slice(0, MAX_VISIBLE_COLUMNS - 1);
    const overflowEvents = columns.slice(MAX_VISIBLE_COLUMNS - 1).flat();

    visibleColumns.forEach((column, columnIndex) => {
      column.forEach((event) => {
        result.push({ ...event, width, left: width * columnIndex });
      });
    });

    const clusterTop = Math.min(...cluster.map((e) => e.top));
    const clusterBottom = Math.max(...cluster.map((e) => e.top + e.height));

    result.push({
      ...overflowEvents[0],
      isOverflow: true,
      overflowCount: overflowEvents.length,
      top: clusterTop,
      height: clusterBottom - clusterTop,
      width,
      left: width * (MAX_VISIBLE_COLUMNS - 1),
    });
  });

  return result;
};

const clipToDay = (start: Date, end: Date, date: Date) => {
  const displayStart = isSameDay(start, date) ? start : startOfDay(date);
  const displayEnd = isSameDay(end, date) ? end : endOfDay(date);

  return { displayStart, displayEnd };
};

function getWeekEvents(
  events: ScheduleEvent[],
  weekDates: Date[],
  maxVisibleColumns = 2,
): EventLayout[] {
  const layouts: EventLayout[] = weekDates.flatMap((date) => {
    const dayEvents = events.filter((event) => {
      const start = new Date(event.startDate);
      const end = new Date(event.endDate);
      return isWithinInterval(date, {
        start: startOfDay(start),
        end: endOfDay(end),
      });
    });

    return dayEvents.map((event) => {
      const start = new Date(event.startDate);
      const end = new Date(event.endDate);
      const { displayStart, displayEnd } = clipToDay(start, end, date);

      const { top, height } = getEventPosition(displayStart, displayEnd, date);

      return { event, date: startOfDay(date), top, height };
    });
  });

  return weekDates.flatMap((date) => {
    const dailyEvents = layouts.filter((e) => isSameDay(e.date, date));
    return applyLayout(dailyEvents, maxVisibleColumns);
  });
}
function getDayEvents(
  events: ScheduleEvent[],
  currentDate: Date,
  maxVisibleColumns = 4,
): EventLayout[] {
  const processed = events
    .filter((event) => {
      const start = new Date(event.startDate);
      const end = new Date(event.endDate);
      return isWithinInterval(currentDate, {
        start: startOfDay(start),
        end: endOfDay(end),
      });
    })
    .map((event) => {
      const start = new Date(event.startDate);
      const end = new Date(event.endDate);
      const { displayStart, displayEnd } = clipToDay(start, end, currentDate);

      const { top, height } = getEventPosition(
        displayStart,
        displayEnd,
        currentDate,
      );

      return { event, date: currentDate, top, height };
    });

  return applyLayout(processed, maxVisibleColumns);
}

const CONFLICT_IGNORE_DURATION_MS = 12 * 60 * 60 * 1000;

const isConflictCandidate = (event: ScheduleEvent) => {
  const duration =
    new Date(event.endDate).getTime() - new Date(event.startDate).getTime();

  return duration < CONFLICT_IGNORE_DURATION_MS;
};

const markConflicts = (
  events: ScheduleEvent[],
  otherEvents: ScheduleEvent[],
): ScheduleEvent[] => {
  if (otherEvents.length === 0) return events;

  const comparableOthers = otherEvents.filter(isConflictCandidate);

  return events.map((event) => {
    if (!isConflictCandidate(event)) {
      return { ...event, hasConflict: false };
    }

    const start = new Date(event.startDate).getTime();
    const end = new Date(event.endDate).getTime();

    const hasConflict = comparableOthers.some((other) => {
      const otherStart = new Date(other.startDate).getTime();
      const otherEnd = new Date(other.endDate).getTime();
      return start < otherEnd && end > otherStart;
    });

    return { ...event, hasConflict };
  });
};

const getSortedDayEvents = (events: ScheduleEvent[], date: Date) => {
  const dayEvents = events.filter((event) => {
    const start = new Date(event.startDate).setHours(0, 0, 0, 0);
    const end = new Date(event.endDate).setHours(23, 59, 59, 999);
    const target = date.getTime();

    return target >= start && target <= end;
  });

  return [...dayEvents].sort((a, b) => {
    const durationA =
      new Date(a.endDate).getTime() - new Date(a.startDate).getTime();
    const durationB =
      new Date(b.endDate).getTime() - new Date(b.startDate).getTime();

    if (durationB !== durationA) {
      return durationB - durationA;
    }

    return byStart(a, b);
  });
};

/**
 * 월뷰 한 주(7일)의 일정 배치. 여러 날에 걸친 일정이 주 안에서 같은 줄(lane)을 유지하도록
 * 시작일 → 긴 기간 순으로 줄을 배정한다. 결과는 날짜별로 lane 인덱스 → 일정(없으면 null).
 */
export type MonthLaneCell = {
  event: ScheduleEvent;
  isStart: boolean;
  isEnd: boolean;
};

const getMonthWeekLanes = (
  events: ScheduleEvent[],
  weekDates: Date[],
): (MonthLaneCell | null)[][] => {
  const weekStart = startOfDay(weekDates[0]).getTime();
  const weekEnd = new Date(weekDates[weekDates.length - 1]).setHours(
    23,
    59,
    59,
    999,
  );

  const segments = events
    .map((event) => {
      const start = new Date(event.startDate).setHours(0, 0, 0, 0);
      const end = new Date(event.endDate).setHours(23, 59, 59, 999);
      if (end < weekStart || start > weekEnd) return null;

      const from = weekDates.findIndex((d) => startOfDay(d).getTime() >= start);
      let to = weekDates.length - 1;
      while (to > 0 && startOfDay(weekDates[to]).getTime() > end) to--;

      return {
        event,
        from: Math.max(from, 0),
        to,
        startAt: new Date(event.startDate).getTime(),
      };
    })
    .filter((seg): seg is NonNullable<typeof seg> => seg !== null)
    .sort((a, b) => {
      if (a.from !== b.from) return a.from - b.from;
      const spanA = a.to - a.from;
      const spanB = b.to - b.from;
      if (spanA !== spanB) return spanB - spanA;
      return a.startAt - b.startAt;
    });

  const lanes: (MonthLaneCell | null)[][] = weekDates.map(() => []);

  for (const seg of segments) {
    let lane = 0;
    while (
      weekDates.some((_, i) => i >= seg.from && i <= seg.to && lanes[i][lane])
    ) {
      lane++;
    }

    for (let i = seg.from; i <= seg.to; i++) {
      while (lanes[i].length <= lane) lanes[i].push(null);
      lanes[i][lane] = {
        event: seg.event,
        isStart: isSameDay(new Date(seg.event.startDate), weekDates[i]),
        isEnd: isSameDay(new Date(seg.event.endDate), weekDates[i]),
      };
    }
  }

  return lanes;
};

function groupByDay(events: ScheduleEvent[]) {
  const days: { date: Date; events: ScheduleEvent[] }[] = [];

  for (const event of events) {
    const date = new Date(event.startDate);
    const last = days[days.length - 1];

    if (last && isSameDay(last.date, date)) last.events.push(event);
    else days.push({ date, events: [event] });
  }

  return days;
}

/** 시작 시각 오름차순 comparator — `.sort(byStart)` */
const byStart = (a: ScheduleEvent, b: ScheduleEvent) =>
  new Date(a.startDate).getTime() - new Date(b.startDate).getTime();

/** 시작 시각이 [from, to] 안에 드는 일정만 */
function eventsInRange(events: ScheduleEvent[], from: Date, to: Date) {
  const f = from.getTime();
  const t = to.getTime();
  return events.filter((e) => {
    const s = new Date(e.startDate).getTime();
    return s >= f && s <= t;
  });
}

export {
  byStart,
  eventsInRange,
  groupByDay,
  canEditSchedule,
  getMonthWeekLanes,
  isSameDate,
  getDayColor,
  findHoliday,
  getWeekDates,
  getDayEvents,
  getWeekEvents,
  getMonthDates,
  getmonthTime,
  getEventPosition,
  getSortedDayEvents,
  markConflicts,
  toScheduleEvent,
  toScheduleRequest,
};
