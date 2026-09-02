"use client";

import { useMemo } from "react";
import { useScheduleStore } from "@/src/hooks/stores/useScheduleStore";
import { useScheduleViewStore } from "@/src/hooks/stores/useScheduleViewStore";
import DayView from "./view/DayView";
import MonthView from "./view/MonthView";
import WeekView from "./view/WeekView";
import { useHolidays, useWeathers } from "@/src/hooks/querys/useCommonApi";
import { useSchedules } from "@/src/hooks/querys/useSchedule";
import { useMyInfo } from "@/src/hooks/querys/useMembers";
import { markConflicts, toScheduleEvent } from "@/src/utils/schedule";

export default function Schedule() {
  const mode = useScheduleStore((s) => s.mode);
  const viewType = useScheduleViewStore((s) => s.viewType);

  const { data: holidays } = useHolidays();
  const { data: weathers, isLoading: isWeatherLoading } = useWeathers();
  const { data: user } = useMyInfo();
  const hasGroup = !!user?.groupCode;

  const { data: personalSchedules } = useSchedules("PERSONAL");
  const { data: groupSchedules } = useSchedules("GROUP", hasGroup);

  const activeSchedules =
    viewType === "PERSONAL" ? personalSchedules : groupSchedules;
  const otherSchedules =
    viewType === "PERSONAL" ? groupSchedules : personalSchedules;

  // 현재 보고 있는 뷰(개인/그룹)와 반대쪽 일정이 시간상 겹치면 카드에 표시한다.
  const events = useMemo(() => {
    const activeEvents = (activeSchedules ?? []).map(toScheduleEvent);
    const otherEvents = (otherSchedules ?? []).map(toScheduleEvent);
    return markConflicts(activeEvents, otherEvents);
  }, [activeSchedules, otherSchedules]);

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
