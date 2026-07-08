"use client";

import { useCalendarStore } from "@//hooks/stores/CalendarStore";
import DayView from "./DayView";
import MonthView from "./MonthView";
import WeekView from "./WeekView";
import { useHolidays, useWeathers } from "@//hooks/querys/useCommonApi";

export default function Calendar() {
  const mode = useCalendarStore((s) => s.mode);
  const { data: holidays } = useHolidays();
  const { data: weathers } = useWeathers();

  if (mode === "day")
    return <DayView holidays={holidays} weathers={weathers} />;
  if (mode === "week")
    return <WeekView holidays={holidays} weathers={weathers} />;
  if (mode === "month")
    return <MonthView holidays={holidays} weathers={weathers} />;

  return null;
}
