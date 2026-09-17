"use client";

import { useMemo } from "react";
import { useScheduleStore } from "@/src/hooks/stores/useScheduleStore";
import { useScheduleView } from "@/src/hooks/useScheduleView";
import DayView from "./view/DayView";
import MonthView from "./view/MonthView";
import WeekView from "./view/WeekView";
import { useHolidays, useWeathers } from "@/src/hooks/querys/useCommonApi";
import { useSchedules } from "@/src/hooks/querys/useSchedule";
import { useActiveGroup } from "@/src/hooks/querys/useGroup";
import GroupPicker from "../group/landing/GroupPicker";
import { markConflicts, toScheduleEvent } from "@/src/utils/schedule";

export default function Schedule() {
  const mode = useScheduleStore((s) => s.mode);
  const { viewType } = useScheduleView();

  const { data: holidays } = useHolidays();
  const { data: weathers, isLoading: isWeatherLoading } = useWeathers();
  const { group, groups, needsSelection } = useActiveGroup();

  const { data: personalSchedules } = useSchedules("PERSONAL");
  const { data: groupSchedules } = useSchedules(
    "GROUP",
    !!group,
    group?.groupNo,
  );

  const activeSchedules =
    viewType === "PERSONAL" ? personalSchedules : groupSchedules;
  const otherSchedules =
    viewType === "PERSONAL" ? groupSchedules : personalSchedules;

  const events = useMemo(() => {
    const activeEvents = (activeSchedules ?? []).map(toScheduleEvent);
    const otherEvents = (otherSchedules ?? []).map(toScheduleEvent);
    return markConflicts(activeEvents, otherEvents);
  }, [activeSchedules, otherSchedules]);

  if (viewType === "GROUP" && needsSelection) {
    return (
      <div className="flex h-full w-full items-center justify-center p-4">
        <GroupPicker groups={groups} />
      </div>
    );
  }

  if (mode === "day")
    return (
      <DayView
        events={events}
        holidays={holidays ?? []}
        weathers={weathers ?? {}}
        isWeatherLoading={isWeatherLoading}
      />
    );
  if (mode === "week")
    return (
      <WeekView
        events={events}
        holidays={holidays ?? []}
        weathers={weathers ?? {}}
        isWeatherLoading={isWeatherLoading}
      />
    );
  if (mode === "month")
    return (
      <MonthView
        events={events}
        holidays={holidays ?? []}
        weathers={weathers ?? {}}
        isWeatherLoading={isWeatherLoading}
      />
    );

  return null;
}
