"use client";

import { useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { format, addDays, startOfDay, endOfDay } from "date-fns";
import { useScheduleStore } from "@/src/hooks/stores/useScheduleStore";
import { useScheduleView } from "@/src/hooks/useScheduleView";
import { useWeathers } from "@/src/hooks/querys/useCommonApi";
import { useSchedules } from "@/src/hooks/querys/useSchedule";
import { useActiveGroup } from "@/src/hooks/querys/useGroup";
import { toScheduleEvent } from "@/src/utils/schedule";
import { ScheduleEvent } from "@/src/types/schedule";
import WeatherBadge from "./components/WeatherBadge";
import { DayGroup } from "./components/DayTimeline";
import BaseCard from "../ui/card/BaseCard";
import { Column } from "../ui/layout/flex";
import { useSheetStore } from "@/src/hooks/stores/useSheetStore";

function getFormattedDateTitle(mode: string, date: Date) {
  if (!date || !(date instanceof Date)) return "";

  if (mode === "month") {
    return format(date, "yyyy년 M월");
  }

  if (mode === "week") {
    const start = new Date(date);
    start.setDate(date.getDate() - date.getDay() + 1);
    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    return `${format(start, "yyyy년 M월 d일")} - ${format(end, "d일")}`;
  }

  return format(date, "yyyy년 M월 d일");
}

function eventsOnDay(schedules: ScheduleEvent[], date: Date) {
  const start = startOfDay(date).getTime();
  const end = endOfDay(date).getTime();

  return schedules
    .filter((e) => {
      const s = new Date(e.startDate).getTime();
      return s >= start && s <= end;
    })
    .sort(
      (a, b) =>
        new Date(a.startDate).getTime() - new Date(b.startDate).getTime(),
    );
}

export default function ScheduleHeader() {
  const { mode, currentDate, next, prev } = useScheduleStore();
  const { viewType } = useScheduleView();
  const { group } = useActiveGroup();
  const { data: weathers, isLoading: isWeatherLoading } = useWeathers();
  const { data: schedules } = useSchedules(viewType, true, group?.groupNo);
  const { openSheet } = useSheetStore();

  const today = useMemo(() => new Date(), []);
  const tomorrow = useMemo(() => addDays(today, 1), [today]);

  const todayKey = format(today, "yyyyMMdd");
  const tomorrowKey = format(tomorrow, "yyyyMMdd");

  const todayWeather = weathers?.[todayKey];
  const tomorrowWeather = weathers?.[tomorrowKey];

  const events = useMemo(
    () => (schedules ?? []).map(toScheduleEvent),
    [schedules],
  );

  const todayEvents = useMemo(
    () => eventsOnDay(events, today),
    [events, today],
  );
  const tomorrowEvents = useMemo(
    () => eventsOnDay(events, tomorrow),
    [events, tomorrow],
  );

  return (
    <BaseCard className="hidden shrink-0 flex-col sm:flex">
      <div className="flex items-center justify-between px-5 py-3 border-b border-divider">
        <button
          type="button"
          onClick={prev}
          aria-label="이전"
          className="w-7 h-7 rounded-lg neu-btn flex items-center justify-center text-foreground btn-spring hover:scale-105"
        >
          <ChevronLeft size={14} strokeWidth={1.75} />
        </button>

        <Column className="items-center gap-0.5">
          <span className="eyebrow">SCHEDULE</span>
          <h2 className="typo-title-2 text-foreground tracking-tight text-center">
            {getFormattedDateTitle(mode, currentDate)}
          </h2>
        </Column>

        <button
          type="button"
          onClick={next}
          aria-label="다음"
          className="w-7 h-7 rounded-lg neu-btn flex items-center justify-center text-foreground btn-spring hover:scale-105"
        >
          <ChevronRight size={14} strokeWidth={1.75} />
        </button>
      </div>

      <div className="grid gap-x-8 gap-y-4 px-5 py-4 lg:grid-cols-2">
        <DayGroup
          date={today}
          events={todayEvents}
          emptyText="오늘은 비어 있어요."
          trailing={
            <WeatherBadge
              targetWeather={todayWeather}
              isLoading={isWeatherLoading}
            />
          }
          onEventClick={(event) => openSheet({ event })}
        />
        <DayGroup
          date={tomorrow}
          events={tomorrowEvents}
          emptyText="내일은 비어 있어요."
          trailing={
            <WeatherBadge
              targetWeather={tomorrowWeather}
              isLoading={isWeatherLoading}
            />
          }
          onEventClick={(event) => openSheet({ event })}
        />
      </div>
    </BaseCard>
  );
}
