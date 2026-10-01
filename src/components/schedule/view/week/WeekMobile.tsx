"use client";

import { format } from "date-fns";

import BaseCard from "@/src/components/ui/card/BaseCard";
import { useSwipe } from "@/src/hooks/useSwipe";
import { ScheduleEvent, ScheduleViewProps } from "@/src/types/schedule";
import AllDayRow from "../../parts/AllDayRow";
import HourColumn from "../../parts/HourColumn";
import NavButton from "../../parts/NavButton";
import WeekDayColumn, { WeekHandlers, WeekLayouts } from "./WeekDayColumn";
import WeekDayHeader from "./WeekDayHeader";

/** 모바일(<sm) 3일 그리드. 스와이프·화살표로 3일씩 이동 */
export default function WeekMobile({
  dates,
  layouts,
  allDay,
  holidays,
  weathers,
  isWeatherLoading,
  scrollRef,
  onPrev,
  onNext,
  ...handlers
}: WeekHandlers &
  Pick<ScheduleViewProps, "holidays" | "weathers" | "isWeatherLoading"> & {
    dates: Date[];
    layouts: WeekLayouts;
    allDay: ScheduleEvent[];
    scrollRef: (el: HTMLDivElement | null) => void;
    onPrev: () => void;
    onNext: () => void;
  }) {
  const swipe = useSwipe(onNext, onPrev);

  return (
    <div className="flex h-full min-h-0 flex-col sm:hidden">
      <BaseCard className="shrink-0 px-3 py-1" glow>
        <div className="mb-3 flex items-center justify-between">
          <NavButton direction="prev" onClick={onPrev} label="이전 주" />
          <div className="flex items-center gap-2">
            <span className="typo-body-2 font-semibold text-accent">
              {format(dates[0], "yyyy년 M월")}
            </span>
            <span className="text-xs text-muted">
              {format(dates[0], "M월 d일")} -{" "}
              {format(dates[dates.length - 1], "M월 d일")}
            </span>
          </div>
          <NavButton direction="next" onClick={onNext} label="다음 주" />
        </div>

        <div className="grid grid-cols-3">
          {dates.map((date, i) => (
            <div
              key={date.toISOString()}
              className={
                i !== dates.length - 1 ? "border-r border-divider/40" : ""
              }
            >
              <WeekDayHeader
                date={date}
                holidays={holidays}
                weathers={weathers}
                isWeatherLoading={isWeatherLoading}
                mobile
              />
            </div>
          ))}
        </div>
      </BaseCard>

      <AllDayRow
        dates={dates}
        events={allDay}
        gutter="36px"
        onClick={handlers.onClickEvent}
      />

      <div
        ref={scrollRef}
        className="min-h-0 flex-1 overflow-y-auto p-2"
        onTouchStart={swipe.onTouchStart}
        onTouchEnd={swipe.onTouchEnd}
      >
        <div className="neu-pressed grid min-h-full grid-cols-[36px_repeat(3,minmax(0,1fr))] rounded-2xl">
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
