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

const toScheduleEvent = (res: ScheduleApiResponse): ScheduleEvent => {
  const startTime = res.startTime ?? "00:00:00";
  const endTime = res.endTime ?? startTime;
  const endDate = res.endDate ?? res.startDate;

  return {
    id: res.id,
    title: res.title,
    content: res.content,
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

const getTimes = (date: string) => {
  return format(new Date(date), "HH:mm");
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
  const height = Math.max((duration / 1440) * 100, (MIN_DURATION_MINUTES / 1440) * 100);

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

const applyLayout = (events: EventLayout[]): EventLayout[] => {
  return events.map((event) => {
    const overlaps = events.filter(
      (other) =>
        event.top < other.top + other.height &&
        event.top + event.height > other.top,
    );

    return {
      ...event,
      width: 100 / overlaps.length,
      left:
        (100 / overlaps.length) *
        overlaps.findIndex((o) => o.event.id === event.event.id),
    };
  });
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
    return applyLayout(dailyEvents);
  });
}
function getDayEvents(
  events: ScheduleEvent[],
  currentDate: Date,
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

  return applyLayout(processed);
}

// 개인/그룹 일정이 겹치는 경우를 표시하기 위해, 다른 뷰의 일정 목록과 시간이 겹치는
// 이벤트에 hasConflict 플래그를 붙인다. 그리드 위치(top/height) 계산과는 무관하게
// 순수 시간 구간 비교만 한다.
const markConflicts = (
  events: ScheduleEvent[],
  otherEvents: ScheduleEvent[],
): ScheduleEvent[] => {
  if (otherEvents.length === 0) return events;

  return events.map((event) => {
    const start = new Date(event.startDate).getTime();
    const end = new Date(event.endDate).getTime();

    const hasConflict = otherEvents.some((other) => {
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
  getTimes,
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
