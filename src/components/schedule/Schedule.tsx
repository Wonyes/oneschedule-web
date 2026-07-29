"use client";

import { useScheduleStore } from "@/src/hooks/stores/useScheduleStore";
import DayView from "./view/DayView";
import MonthView from "./view/MonthView";
import WeekView from "./view/WeekView";
import { useHolidays, useWeathers } from "@/src/hooks/querys/useCommonApi";
import { dummyEvents } from "@/src/constant/schedule";

export default function Schedule() {
  const mode = useScheduleStore((s) => s.mode);

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
