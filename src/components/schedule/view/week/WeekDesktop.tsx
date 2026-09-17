"use client";

import { Timer } from "lucide-react";

import BaseCard from "@/src/components/ui/card/BaseCard";
import { ScheduleViewProps } from "@/src/types/schedule";
import HourColumn from "../../parts/HourColumn";
import WeekDayColumn, { WeekHandlers, WeekLayouts } from "./WeekDayColumn";
import WeekDayHeader from "./WeekDayHeader";

/** 데스크톱(sm↑) 7일 그리드 */
export default function WeekDesktop({
  dates,
  layouts,
  holidays,
  weathers,
  isWeatherLoading,
  scrollRef,
  ...handlers
}: WeekHandlers &
  Pick<ScheduleViewProps, "holidays" | "weathers" | "isWeatherLoading"> & {
    dates: Date[];
    layouts: WeekLayouts;
    scrollRef: (el: HTMLDivElement | null) => void;
  }) {
  return (
    <div className="hidden h-full min-h-0 flex-col sm:flex">
      <div className="shrink-0 px-2.5">
        <BaseCard glow>
          <div className="grid h-12 grid-cols-[60px_repeat(7,minmax(0,1fr))] border-b border-divider pt-1">
            <div className="flex items-center justify-center border-r border-divider/40 text-muted">
              <Timer size={14} />
            </div>
            {dates.map((date) => (
              <div
                key={date.toISOString()}
                className="border-r border-divider/40 last:border-r-0"
              >
                <WeekDayHeader
                  date={date}
                  holidays={holidays}
                  weathers={weathers}
                  isWeatherLoading={isWeatherLoading}
                />
              </div>
            ))}
          </div>
        </BaseCard>
      </div>

      <div ref={scrollRef} className="min-h-0 flex-1 overflow-y-auto p-2">
        <div className="neu-pressed grid min-h-full grid-cols-[60px_repeat(7,minmax(0,1fr))] rounded-2xl">
          <HourColumn />
          {dates.map((date) => (
            <WeekDayColumn
              key={date.toISOString()}
              date={date}
              layouts={layouts}
              {...handlers}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
