"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { format, addDays } from "date-fns";
import { useScheduleStore } from "@/src/hooks/stores/useScheduleStore";
import { useWeathers } from "@/src/hooks/querys/useCommonApi";
import WeatherBadge from "./components/WeatherBadge";
import BaseCard from "../ui/card/BaseCard";

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

export default function ScheduleHeader() {
  const { mode, currentDate, next, prev } = useScheduleStore();
  const { data: weathers } = useWeathers();

  const todayKey = format(currentDate, "yyyyMMdd");
  const tomorrowKey = format(addDays(currentDate, 1), "yyyyMMdd");

  const todayWeather = weathers?.[todayKey];
  const tomorrowWeather = weathers?.[tomorrowKey];

  return (
    <BaseCard className="hidden sm:flex flex-col shrink-0 overflow-hidden" glow>
      <div className="flex items-center justify-between px-6 py-4 border-b border-divider">
        <button
          onClick={prev}
          className="w-8 h-8 rounded-xl neu-btn flex items-center justify-center text-foreground transition-all hover:scale-105"
        >
          <ChevronLeft size={16} />
        </button>

        <h2 className="typo-sub-t-3 text-foreground font-bold tracking-tight text-center">
          {getFormattedDateTitle(mode, currentDate)}
        </h2>

        <button
          onClick={next}
          className="w-8 h-8 rounded-xl neu-btn flex items-center justify-center text-foreground transition-all hover:scale-105"
        >
          <ChevronRight size={16} />
        </button>
      </div>

      <div className="p-5">
        <div className="neu-flat rounded-2xl p-4 flex flex-col gap-3">
          <h3 className="typo-sub-t-3 font-bold text-foreground">
            오늘의 주요 일정
          </h3>
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between neu-pressed px-4 py-3 rounded-xl text-xs text-secondary">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue inline-block" />
                <span>오늘의 주요 일정</span>
              </div>
              <div className="flex items-center gap-2 text-foreground font-medium">
                <span>일정 계획을 입력하세요.</span>
                <WeatherBadge targetWeather={todayWeather} />
              </div>
            </div>

            <div className="flex items-center justify-between neu-pressed px-4 py-3 rounded-xl text-xs text-secondary">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400 inline-block" />
                <span>내일의 계획</span>
              </div>
              <div className="flex items-center gap-2 text-foreground font-medium">
                <span>내일의 계획을 입력하세요.</span>
                <WeatherBadge targetWeather={tomorrowWeather} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </BaseCard>
  );
}
