"use client";

import { useMemo } from "react";
import { addDays, endOfDay, startOfDay } from "date-fns";

import { useSchedules } from "@/src/hooks/querys/useSchedule";
import { toScheduleEvent } from "@/src/utils/schedule";

export const UPCOMING_RANGE_DAYS = 7;

export function useGroupSchedules(groupNo: number) {
  const { data: schedules, isLoading } = useSchedules("GROUP", true, groupNo);

  const { today, upcoming } = useMemo(() => {
    const now = new Date();
    const todayStart = startOfDay(now).getTime();
    const todayEnd = endOfDay(now).getTime();
    const upcomingEnd = endOfDay(addDays(now, UPCOMING_RANGE_DAYS)).getTime();

    const events = (schedules ?? [])
      .map(toScheduleEvent)
      .sort(
        (a, b) =>
          new Date(a.startDate).getTime() - new Date(b.startDate).getTime(),
      );

    const startOf = (e: (typeof events)[number]) =>
      new Date(e.startDate).getTime();

    return {
      today: events.filter((e) => {
        const s = startOf(e);
        return s >= todayStart && s <= todayEnd;
      }),
      upcoming: events.filter((e) => {
        const s = startOf(e);
        return s > todayEnd && s <= upcomingEnd;
      }),
    };
  }, [schedules]);

  return { today, upcoming, isLoading };
}
