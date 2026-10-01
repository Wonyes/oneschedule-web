import { endOfDay, isSameDay, startOfDay, isWithinInterval } from "date-fns";

import { EventLayout, ScheduleEvent } from "../types/schedule";
import { byStart } from "./schedule";

/**
 * 일정 겹침 계산과 레인 배치.
 * 폭은 개별 일정이 아니라 "연결된 덩어리(클러스터)의 열 개수"로 나눈다 —
 * A-B, B-C는 겹치는데 A-C는 안 겹치는 체인형에서 서로를 침범하지 않게.
 */

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

/** 시작일과 종료일이 다른 날 — 시간 격자 대신 종일 줄에 그린다 */
const isMultiDay = (event: ScheduleEvent) =>
  !isSameDay(new Date(event.startDate), new Date(event.endDate));

/** 시간 격자에 놓을 것과 종일 줄에 놓을 것으로 가른다 */
const splitMultiDay = (events: ScheduleEvent[]) => ({
  timed: events.filter((e) => !isMultiDay(e)),
  multiDay: events.filter(isMultiDay),
});

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

export {
  getEventPosition,
  getWeekEvents,
  getDayEvents,
  markConflicts,
  getSortedDayEvents,
  isMultiDay,
  splitMultiDay,
  getMonthWeekLanes,
};
