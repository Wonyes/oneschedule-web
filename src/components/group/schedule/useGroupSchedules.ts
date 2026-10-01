"use client";

import { useMemo } from "react";
import { addDays, endOfDay, startOfDay } from "date-fns";

import { useSchedules } from "@/src/hooks/querys/useSchedule";
import { byStart, eventsInRange, toScheduleEvent } from "@/src/utils/schedule";

export const UPCOMING_RANGE_DAYS = 7;

export function useGroupSchedules(groupNo: number) {
  const { data: schedules, isLoading } = useSchedules("GROUP", true, groupNo);

  const { today, upcoming } = useMemo(() => {
    const now = new Date();
    const events = (schedules ?? []).map(toScheduleEvent).sort(byStart);

    return {
      today: eventsInRange(events, startOfDay(now), endOfDay(now)),
      upcoming: eventsInRange(
        events,
        startOfDay(addDays(now, 1)),
        endOfDay(addDays(now, UPCOMING_RANGE_DAYS)),
      ),
    };
  }, [schedules]);

  return { today, upcoming, isLoading };
}
