"use client";

import { useRef } from "react";
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
const WHEEL_COOLDOWN = 260;

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
 * 휠·스와이프로 돌리면 기간이 바뀐다. 제목과 화살표를 대신한다.
 */
export default function ScheduleDial({
  weathers,
}: {
  weathers?: ProcessedWeather;
}) {
  const { mode, currentDate, next, prev, setCurrentDate } = useScheduleStore();
  const ticks = buildTicks(mode, currentDate, weathers);
  const lastWheel = useRef(0);
  const swipe = useSwipe(next, prev);

  const onWheel = (e: React.WheelEvent) => {
    const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
    if (Math.abs(delta) < 8) return;
    const t = Date.now();
    if (t - lastWheel.current < WHEEL_COOLDOWN) return;
    lastWheel.current = t;
    if (delta > 0) next();
    else prev();
  };

  return (
    <div
      role="group"
      aria-label="기간 선택 다이얼"
      onWheel={onWheel}
      {...swipe}
      className="relative flex min-w-0 flex-1 select-none items-center justify-center overflow-hidden py-1"
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
              onClick={() => !tick.current && setCurrentDate(tick.date)}
              aria-current={tick.current ? "date" : undefined}
              aria-label={format(tick.date, "yyyy년 M월 d일", { locale: ko })}
              className={cn(
                "btn-spring flex shrink-0 flex-col items-center justify-center rounded-2xl transition-colors",
                tick.current
                  ? "neu-flat h-16 min-w-24 px-4 text-foreground"
                  : "h-12 min-w-16 px-2 text-place-h hover:text-secondary",
                distance === 2 && "opacity-70",
                distance === 3 && "opacity-40",
              )}
            >
              {tick.secondary && (
                <span
                  className={cn(
                    "typo-caption-3",
                    tick.current ? "text-accent" : "text-place-h",
                  )}
                >
                  {tick.secondary}
                </span>
              )}
              <span
                className={cn(
                  "leading-none tabular-nums",
                  tick.current
                    ? "typo-title-2 font-bold"
                    : "typo-sub-t-2 font-semibold",
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
  );
}
