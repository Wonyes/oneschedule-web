"use client";

import { useMemo } from "react";
import { useScheduleStore } from "@/src/hooks/stores/useScheduleStore";
import { useScheduleViewStore } from "@/src/hooks/stores/useScheduleViewStore";
import DayView from "./view/DayView";
import MonthView from "./view/MonthView";
import WeekView from "./view/WeekView";
import { useHolidays, useWeathers } from "@/src/hooks/querys/useCommonApi";
import { useSchedules } from "@/src/hooks/querys/useSchedule";
import { toScheduleEvent } from "@/src/utils/schedule";

export default function Schedule() {
  const mode = useScheduleStore((s) => s.mode);
  const viewType = useScheduleViewStore((s) => s.viewType);

  const { data: holidays } = useHolidays();
  const { data: weathers, isLoading: isWeatherLoading } = useWeathers();
  const { data: schedules } = useSchedules(viewType);

  const events = useMemo(
    () => (schedules ?? []).map(toScheduleEvent),
    [schedules],
  );

  if (mode === "day")
    return (
      <DayView
        events={events}
        holidays={holidays}
        weathers={weathers}
        isWeatherLoading={isWeatherLoading}
      />
    );
  if (mode === "week")
    return (
      <WeekView
        events={events}
        holidays={holidays}
        weathers={weathers}
        isWeatherLoading={isWeatherLoading}
      />
    );
  if (mode === "month")
    return (
      <MonthView
        events={events}
        holidays={holidays}
        weathers={weathers}
        isWeatherLoading={isWeatherLoading}
      />
    );

  return null;
}
