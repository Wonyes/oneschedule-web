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
    // 서버는 작성자를 author.memberNo로 내려준다. 권한 판정(canEditSchedule)이
    // 보는 필드는 createdBy이므로 여기서 옮겨 담는다.
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
  const start = startOfWeek(currentDate, { weekStartsOn: 1 });
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

  // 그리드 행 높이가 브레이크포인트별 CSS 값이라 절대 px 대신 하루(1440분) 대비 비율(%)로 위치를 계산한다.
  const top = Math.min(Math.max((totalMinutes / 1440) * 100, 0), 100);
  // 종료 시각이 비었거나 시작과 같은 일정도 시간 칸 하나(60분)는 꽉 채워서 보여준다.
  const MIN_DURATION_MINUTES = 60;
  const height = Math.max(
    (duration / 1440) * 100,
    (MIN_DURATION_MINUTES / 1440) * 100,
  );

  return { top, height };
};

const getMonthDates = (currentDate: Date) => {
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const gridStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const gridEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });

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
  if (isHoliday) return "text-red-800";
  if (isSunday(date)) return "text-red-600";
  if (isSaturday(date)) return "text-blue-600";
  return "text-muted";
};

export const getWeatherIcon = (pty: string, sky: string): string => {
  const rainIcons: Record<string, string> = {
    "1": "🌧️",
    "2": "🌨️",
    "3": "❄️",
    "4": "🌦️",
  };

  if (pty !== "0") return rainIcons[pty] || "";

  const skyIcons: Record<string, string> = {
    "1": "☀️",
    "3": "⛅",
    "4": "☁️",
  };

  return skyIcons[sky] || "";
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

/**
 * 일정을 수정·삭제할 수 있는지 판정한다. 작성자 본인이거나 그룹 관리자(SUPER)면 가능.
 *
 * 이건 어디까지나 화면 처리를 위한 것이고, 실제 차단은 서버가 한다.
 * 두 값 중 하나라도 없으면(구버전 서버 응답 등) 판정을 건너뛰고 허용한다 —
 * 그러지 않으면 자기 일정도 못 고치게 된다.
 */
const canEditSchedule = ({
  createdBy,
  myMemberNo,
  myGroupRole,
}: {
  createdBy?: number;
  myMemberNo?: number;
  myGroupRole?: "SUPER" | "SUB" | "MEMBER";
}): boolean => {
  if (myGroupRole === "SUPER") return true;

  if (createdBy === undefined || myMemberNo === undefined) return true;

  return createdBy === myMemberNo;
};

const isOverlapping = (a: EventLayout, b: EventLayout) =>
  a.top < b.top + b.height && a.top + a.height > b.top;

// 겹치는 일정들의 가로 배치.
// 각 일정이 "자기와 겹치는 것"만 세면, A-B / B-C만 겹치고 A-C는 안 겹치는 체인에서
// 일정마다 분모가 달라져 폭이 어긋나고 카드가 서로 침범한다.
// 그래서 (1) 겹침으로 연결된 일정들을 하나의 그룹으로 묶고,
// (2) 그룹 안에서 서로 겹치지 않는 일정끼리는 같은 열을 재사용하도록 열을 배정한 뒤,
// (3) 그룹의 열 개수로 폭을 나눈다.
const applyLayout = (
  events: EventLayout[],
  maxVisibleColumns = 3,
): EventLayout[] => {
  if (events.length === 0) return events;

  const sorted = [...events].sort((a, b) => a.top - b.top);

  // (1) 겹침으로 연결된 덩어리(클러스터) 만들기
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
    // (2) 열 배정: 기존 열의 마지막 일정과 겹치지 않으면 그 열을 재사용
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
      // (3) 클러스터의 열 개수로 폭을 나눈다
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

// 하루를 벗어나는 일정은 시작/종료 시각을 그 날의 00:00~24:00으로 잘라서
// top/height(%)를 계산해야 한다. 그렇지 않으면 여러 날에 걸친 일정의
// height가 100%를 넘거나(week) 음수가 되어(day) 카드 높이가 그리드와 어긋난다.
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

// 하루 대부분(12시간 이상)을 차지하는 일정은 마감형 할 일에 가까워서, 그 시간대에
// 걸리는 모든 일정을 전부 "충돌"로 띄우면 오히려 신호가 무의미해진다.
// 그래서 이런 일정은 충돌 비교 자체에서 제외한다(본인도, 상대도 충돌로 표시하지 않음).
const CONFLICT_IGNORE_DURATION_MS = 12 * 60 * 60 * 1000;

const isConflictCandidate = (event: ScheduleEvent) => {
  const duration =
    new Date(event.endDate).getTime() - new Date(event.startDate).getTime();

  return duration < CONFLICT_IGNORE_DURATION_MS;
};

// 개인/그룹 일정이 겹치는 경우를 표시하기 위해, 다른 뷰의 일정 목록과 시간이 겹치는
// 이벤트에 hasConflict 플래그를 붙인다. 그리드 위치(top/height) 계산과는 무관하게
// 순수 시간 구간 비교만 한다.
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

    return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
  });
};

export {
  canEditSchedule,
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
