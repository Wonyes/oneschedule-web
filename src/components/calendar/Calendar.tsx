"use client";

import { useCalendarStore } from "@//hooks/stores/CalendarStore";
import DayView from "./DayView";
import MonthView from "./MonthView";
import { useHolidays, useWeathers } from "@//hooks/querys/useCommonApi";
import { dummyEvents } from "@/constant/calendar";
import WeekView from "./WeekView";

export default function Calendar() {
  const mode = useCalendarStore((s) => s.mode);

  const { data: holidays } = useHolidays();
  const { data: weathers } = useWeathers();

  const events = dummyEvents;

  if (mode === "day")
    return <DayView events={events} holidays={holidays} weathers={weathers} />;
  if (mode === "week")
    return <WeekView events={events} holidays={holidays} weathers={weathers} />;
  if (mode === "month")
    return (
      <MonthView events={events} holidays={holidays} weathers={weathers} />
    );

  return null;
}
