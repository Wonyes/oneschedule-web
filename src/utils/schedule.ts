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
} from "date-fns";

import {
  ScheduleEvent,
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
  toScheduleEvent,
  toScheduleRequest,
  getWeekDates,
  getMonthDates,
  isSameDate,
  findHoliday,
  getDayColor,
  getmonthTime,
  canEditSchedule,
  groupByDay,
  byStart,
  eventsInRange,
};

/** 겹침·레인 계산은 lanes.ts로 옮겼다. 호출부가 많아 여기서 다시 내보낸다 */
export {
  getEventPosition,
  getWeekEvents,
  getDayEvents,
  markConflicts,
  getSortedDayEvents,
  isMultiDay,
  splitMultiDay,
  getMonthWeekLanes,
} from "./lanes";
export type { MonthLaneCell } from "./lanes";

/** 기상 코드 변환은 weather.ts로 옮겼다 */
export { getWeatherKind } from "./weather";
export type { WeatherKind } from "./weather";
