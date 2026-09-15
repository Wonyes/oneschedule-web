"use client";

import { addDays, addMonths, format, isSameDay, isToday } from "date-fns";
import { ko } from "date-fns/locale";
import { motion } from "motion/react";

import { Column } from "@/src/components/ui/layout/flex";
import { useScheduleStore } from "@/src/hooks/stores/useScheduleStore";
import { useSwipe } from "@/src/hooks/useSwipe";
import { springSnappy } from "@/src/lib/motion";
import { ProcessedWeather } from "@/src/types/schedule";
import { cn } from "@/src/utils/cn";
import { getWeekDates } from "@/src/utils/schedule";
import WeatherIcon from "./components/WeatherIcon";

/** 가운데 기준 양옆으로 몇 눈금까지 보여줄지 */
const REACH = 3;

type Tick = {
  key: string;
  date: Date;
  primary: string;
  secondary?: string;
  weather?: { pty: string; sky: string; tmp: string };
  current: boolean;
  today: boolean;
};

function buildTicks(
  mode: "day" | "week" | "month",
  currentDate: Date,
  weathers?: ProcessedWeather,
): Tick[] {
  const ticks: Tick[] = [];
  const now = new Date();

  for (let offset = -REACH; offset <= REACH; offset++) {
    if (mode === "month") {
      const date = addMonths(currentDate, offset);
      ticks.push({
        key: format(date, "yyyy-MM"),
        date,
        primary: format(date, "M월"),
        secondary:
          offset === 0 || date.getMonth() === 0
            ? format(date, "yyyy")
            : undefined,
        current: offset === 0,
        today:
          date.getMonth() === now.getMonth() &&
          date.getFullYear() === now.getFullYear(),
      });
    } else if (mode === "week") {
      const date = addDays(currentDate, offset * 7);
      const week = getWeekDates(date);
      ticks.push({
        key: format(week[0], "yyyy-MM-dd"),
        date,
        primary: `${format(week[0], "M/d")}–${format(week[6], "M/d")}`,
        secondary: offset === 0 ? format(week[0], "yyyy년 M월") : undefined,
        current: offset === 0,
        today: week.some((d) => isSameDay(d, now)),
      });
    } else {
      const date = addDays(currentDate, offset);
      const w = weathers?.[format(date, "yyyyMMdd")];
      ticks.push({
        key: format(date, "yyyy-MM-dd"),
        date,
        primary: format(date, "d"),
        secondary: format(date, "EEE", { locale: ko }),
        weather: w ? { pty: w.PTY, sky: w.SKY, tmp: w.TMP } : undefined,
        current: offset === 0,
        today: isToday(date),
      });
    }
  }
  return ticks;
}

/**
 * 스케줄 헤더의 다이얼. 가운데 눈금이 지금 보는 기간이고, 옆 눈금을 누르거나
 * 스와이프하면 기간이 바뀐다. 제목과 화살표를 대신한다.
 */
export default function ScheduleDial({
  weathers,
}: {
  weathers?: ProcessedWeather;
}) {
  const { mode, currentDate, next, prev, setCurrentDate } = useScheduleStore();
  const ticks = buildTicks(mode, currentDate, weathers);
  const swipe = useSwipe(next, prev);

  const cornerLabel =
    mode === "month"
      ? format(currentDate, "yyyy")
      : mode === "week"
        ? format(currentDate, "yyyy년 M월")
        : format(currentDate, "yyyy년 M월 EEEE", { locale: ko });

  return (
    <div className="relative min-w-0 flex-1">
      {/* 연도(주/일 뷰는 년월·요일) — 다이얼 왼쪽 위 구석. 마스크 밖이라 흐려지지 않는다 */}
      <span className="pointer-events-none absolute left-1 top-0 z-10 text-[10px] font-semibold leading-none tracking-wide text-accent sm:left-2">
        {cornerLabel}
      </span>

      <div
        role="group"
        aria-label="기간 선택 다이얼"
        {...swipe}
        className="relative flex min-w-0 select-none items-center justify-center overflow-hidden py-0.5 sm:py-1"
        style={{
          maskImage:
            "linear-gradient(to right, transparent, black 18%, black 82%, transparent)",
          WebkitMaskImage:
            "linear-gradient(to right, transparent, black 18%, black 82%, transparent)",
        }}
      >
        <div className="flex items-center gap-1 sm:gap-2">
          {ticks.map((tick, i) => {
            const distance = Math.abs(i - REACH);
            return (
              <motion.button
                key={tick.key}
                type="button"
                layout
                transition={springSnappy}
                onClick={() =>
                  setCurrentDate(tick.current ? new Date() : tick.date)
                }
                aria-current={tick.current ? "date" : undefined}
                aria-label={
                  tick.current
                    ? "오늘로 이동"
                    : format(tick.date, "yyyy년 M월 d일", { locale: ko })
                }
                title={tick.current && !tick.today ? "오늘로" : undefined}
                className={cn(
                  "btn-spring relative flex shrink-0 flex-col items-center justify-center rounded-2xl transition-colors",
                  tick.current
                    ? "neu-flat h-10 min-w-20 px-3 text-foreground sm:h-12 sm:min-w-24 sm:px-4"
                    : "h-10 min-w-14 px-1.5 text-place-h hover:text-secondary sm:h-12 sm:min-w-16 sm:px-2",
                  distance === 2 && "opacity-70",
                  distance === 3 && "opacity-40",
                )}
              >
                {tick.secondary && !tick.current && (
                  <span className="whitespace-nowrap typo-caption-3 text-place-h">
                    {tick.secondary}
                  </span>
                )}
                <span
                  className={cn(
                    "leading-none tabular-nums",
                    tick.current
                      ? "typo-sub-t-1 font-bold sm:typo-title-2"
                      : "typo-caption-1 font-semibold sm:typo-sub-t-2",
                    tick.today && !tick.current && "text-accent",
                  )}
                >
                  {tick.primary}
                </span>
                {tick.weather && (
                  <Column className="mt-1 flex-row items-center gap-1 typo-caption-3 text-place-h">
                    <WeatherIcon
                      pty={tick.weather.pty}
                      sky={tick.weather.sky}
                      size={11}
                    />
                    {tick.current && <span>{tick.weather.tmp}°</span>}
                  </Column>
                )}
                {tick.today && (
                  <span
                    aria-hidden
                    className="mt-1 h-1 w-1 rounded-full bg-accent"
                  />
                )}
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
