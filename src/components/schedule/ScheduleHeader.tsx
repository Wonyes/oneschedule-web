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
import { ScheduleEvent, WeatherData } from "@/src/types/schedule";
import WeatherBadge from "./components/WeatherBadge";
import BaseCard from "../ui/card/BaseCard";
import { Column } from "../ui/layout/flex";
import { getTimes } from "@/src/utils/time";

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

function SummaryRow({
  label,
  dotClassName,
  events,
  weather,
  isWeatherLoading,
}: {
  label: string;
  dotClassName: string;
  events: ScheduleEvent[];
  weather?: WeatherData;
  isWeatherLoading?: boolean;
}) {
  const primary = events[0];

  return (
    <div className="flex items-center justify-between neu-flat px-4 py-3 rounded-nest-row text-xs text-secondary">
      <div className="flex items-center gap-2 shrink-0">
        <span
          className={`w-1.5 h-1.5 rounded-full inline-block ${dotClassName}`}
        />
        <span>{label}</span>
      </div>
      <div className="flex items-center gap-2 min-w-0 text-foreground font-medium">
        {primary ? (
          <span className="truncate">
            {getTimes(primary.startDate)} · {primary.title}
            {events.length > 1 ? ` 외 ${events.length - 1}건` : ""}
          </span>
        ) : (
          <span className="text-muted font-normal">일정이 없어요</span>
        )}
        <WeatherBadge targetWeather={weather} isLoading={isWeatherLoading} />
      </div>
    </div>
  );
}

export default function ScheduleHeader() {
  const { mode, currentDate, next, prev } = useScheduleStore();
  const { viewType } = useScheduleView();
  const { group } = useActiveGroup();
  const { data: weathers, isLoading: isWeatherLoading } = useWeathers();
  const { data: schedules } = useSchedules(viewType, true, group?.groupNo);

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
    <BaseCard className="hidden sm:flex flex-col shrink-0 overflow-hidden" glow>
      <div className="flex items-center justify-between px-5 py-3 border-b border-divider">
        <button
          onClick={prev}
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
          onClick={next}
          className="w-7 h-7 rounded-lg neu-btn flex items-center justify-center text-foreground btn-spring hover:scale-105"
        >
          <ChevronRight size={14} strokeWidth={1.75} />
        </button>
      </div>

      <div className="p-5">
        <div className="neu-flat rounded-nest p-4 flex flex-col gap-3">
          <h3 className="typo-sub-t-3 font-bold text-foreground">
            오늘의 주요 일정
          </h3>
          <div className="flex flex-col gap-2">
            <SummaryRow
              label="오늘의 주요 일정"
              dotClassName="bg-accent"
              events={todayEvents}
              weather={todayWeather}
              isWeatherLoading={isWeatherLoading}
            />

            <SummaryRow
              label="내일의 계획"
              dotClassName="bg-muted"
              events={tomorrowEvents}
              weather={tomorrowWeather}
              isWeatherLoading={isWeatherLoading}
            />
          </div>
        </div>
      </div>
    </BaseCard>
  );
}
