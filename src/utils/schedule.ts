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
  eachDayOfInterval,
  isWithinInterval,
  startOfDay,
  endOfDay,
} from "date-fns";
import { ScheduleEvent, EventLayout, holidayType } from "../types/schedule";

const getTimes = (date: string) => {
  return format(new Date(date), "HH:mm");
};

const getDays = (date: string) => {
  return format(new Date(date), "EEEE");
};

const getDaysOfTime = (date: string) => {
  return format(new Date(date), "MM-dd HH:mm");
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

  const top = totalMinutes * (1344 / 1440);
  const height = duration * (1344 / 1440);

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

const isHoliday = (date: Date, holidays: holidayType[]) => {
  if (!holidays) return false;

  return holidays.some((h) => {
    const holidayDate = new Date(
      `${h.locdate.substring(0, 4)}-${h.locdate.substring(4, 6)}-${h.locdate.substring(6, 8)}`,
    );
    return isSameDay(holidayDate, date);
  });
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

const getEventsForDate = (events: ScheduleEvent[], targetDate: Date) => {
  return events
    .map((event) => {
      const start = new Date(event.startDate);
      const end = new Date(event.endDate);

      const dayStart = new Date(targetDate);
      dayStart.setHours(0, 0, 0, 0);

      const dayEnd = new Date(targetDate);
      dayEnd.setHours(23, 59, 59, 999);

      if (start <= dayEnd && end >= dayStart) {
        const displayStart = start < dayStart ? dayStart : start;
        const displayEnd = end > dayEnd ? dayEnd : end;

        return { ...event, displayStart, displayEnd };
      }
      return null;
    })
    .filter(Boolean) as (ScheduleEvent & {
    displayStart: Date;
    displayEnd: Date;
  })[];
};

const splitEventByDate = (event: ScheduleEvent) => {
  const start = new Date(event.startDate);
  const end = new Date(event.endDate);

  const days = eachDayOfInterval({ start, end });

  return days.map((day) => {
    const isFirstDay = isSameDay(day, start);
    const isLastDay = isSameDay(day, end);

    return {
      ...event,
      displayStart: isFirstDay ? start : new Date(day.setHours(0, 0, 0, 0)),
      displayEnd: isLastDay ? end : new Date(day.setHours(23, 59, 59, 999)),
    };
  });
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

function getWeekEvents(
  events: ScheduleEvent[],
  weekDates: Date[],
): EventLayout[] {
  const layouts: EventLayout[] = events.map((event) => {
    const start = new Date(event.startDate);
    const end = new Date(event.endDate);

    const { top, height } = getEventPosition(start, end, start);

    return {
      event,
      date: startOfDay(start),
      top,
      height,
    };
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

      const displayStart = new Date(currentDate);
      displayStart.setHours(start.getHours(), start.getMinutes(), 0, 0);

      const displayEnd = new Date(currentDate);
      displayEnd.setHours(end.getHours(), end.getMinutes(), 0, 0);

      const { top, height } = getEventPosition(
        displayStart,
        displayEnd,
        currentDate,
      );

      return { event, date: currentDate, top, height };
    });

  return applyLayout(processed);
}

export {
  getDays,
  getTimes,
  isHoliday,
  isSameDate,
  getDayColor,
  findHoliday,
  getWeekDates,
  getDayEvents,
  getDaysOfTime,
  getWeekEvents,
  getMonthDates,
  getmonthTime,
  splitEventByDate,
  getEventsForDate,
  getEventPosition,
};
