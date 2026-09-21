"use client";

import { useMemo, useState } from "react";
import { format, isSameDay, isSameMonth } from "date-fns";
import { ko } from "date-fns/locale";
import { Plus } from "lucide-react";

import WeatherBadge from "@/src/components/common/weather/WeatherBadge";
import EmptyState from "@/src/components/ui/EmptyState";
import { useScheduleStore } from "@/src/hooks/stores/useScheduleStore";
import { useSheetStore } from "@/src/hooks/stores/useSheetStore";
import { useScheduleView } from "@/src/hooks/useScheduleView";
import { useSwipe } from "@/src/hooks/useSwipe";
import { ScheduleViewProps } from "@/src/types/schedule";
import {
  findHoliday,
  getDayColor,
  getSortedDayEvents,
} from "@/src/utils/schedule";
import { cn } from "@/src/utils/cn";
import ScheduleCard from "../../parts/card/ScheduleCard";
import WeekdayRow from "./WeekdayRow";

/** 모바일(<sm) 월뷰: 날짜 스트립 + 고른 날의 일정 목록 */
export default function MonthMobile({
  monthDates,
  events,
  holidays,
  weathers,
  isWeatherLoading,
}: ScheduleViewProps & { monthDates: Date[] }) {
  const currentDate = useScheduleStore((s) => s.currentDate);
  const next = useScheduleStore((s) => s.next);
  const prev = useScheduleStore((s) => s.prev);
  const { viewType } = useScheduleView();
  const { openSheet } = useSheetStore();
  const swipeHandlers = useSwipe(next, prev);

  // 달이 바뀌면 선택일도 그 달로
  const [selectedDate, setSelectedDate] = useState(currentDate);
  const [prevCurrentDate, setPrevCurrentDate] = useState(currentDate);
  if (currentDate !== prevCurrentDate) {
    setPrevCurrentDate(currentDate);
    setSelectedDate(currentDate);
  }

  const selectedEvents = useMemo(
    () => getSortedDayEvents(events, selectedDate),
    [events, selectedDate],
  );

  const addOnSelected = () => openSheet({ date: selectedDate, type: viewType });

  return (
    <div
      className="flex min-h-0 flex-1 flex-col overflow-y-auto sm:hidden"
      {...swipeHandlers}
    >
      <WeekdayRow compact />

      <div className="grid shrink-0 grid-cols-7 px-2 pb-1.5">
        {monthDates.map((date) => {
          const isSelected = isSameDay(date, selectedDate);
          const isToday = isSameDay(date, new Date());
          const dots = getSortedDayEvents(events, date).slice(0, 3);

          return (
            <button
              type="button"
              key={date.toISOString()}
              onClick={() => setSelectedDate(date)}
              className={cn(
                "flex flex-col items-center gap-0.5 py-0.5 transition-transform active:scale-95",
                !isSameMonth(date, currentDate) && "opacity-40",
              )}
            >
              <span
                className={cn(
                  "flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium transition-colors",
                  isSelected
                    ? "bg-accent text-on-primary"
                    : isToday
                      ? "border border-accent text-accent"
                      : getDayColor(date, findHoliday(date, holidays)),
                )}
              >
                {format(date, "d")}
              </span>

              <span className="flex h-2 items-center gap-0.5">
                <WeatherBadge
                  targetWeather={weathers?.[format(date, "yyyyMMdd")]}
                  isLoading={isWeatherLoading}
                  iconOnly
                />
                {dots.map((event) => (
                  <span
                    key={event.id}
                    className="h-1 w-1 rounded-full bg-accent"
                    aria-hidden
                  />
                ))}
              </span>
            </button>
          );
        })}
      </div>

      <div className="shrink-0 border-t border-divider px-3 py-3">
        <div className="mb-2 flex items-center justify-between">
          <span className="typo-body-2 font-semibold text-accent">
            {format(selectedDate, "M월 d일 EEEE", { locale: ko })}
          </span>
          <button
            type="button"
            onClick={addOnSelected}
            aria-label="일정 추가"
            className="flex h-8 w-8 items-center justify-center rounded-full text-muted transition hover:bg-muted/10 active:scale-95"
          >
            <Plus size={16} />
          </button>
        </div>

        {selectedEvents.length === 0 ? (
          <EmptyState
            title="이 날은 비어 있어요."
            action={
              <button
                type="button"
                onClick={addOnSelected}
                className="btn-spring neu-btn flex h-9 items-center gap-1.5 rounded-xl px-4 typo-caption-2 font-medium text-secondary hover:text-foreground"
              >
                <Plus size={14} strokeWidth={2} />
                일정 추가
              </button>
            }
          />
        ) : (
          <div className="flex flex-col gap-2">
            {selectedEvents.map((event) => (
              <ScheduleCard
                key={event.id}
                event={event}
                date={selectedDate}
                variant="agenda"
                onClick={() => openSheet({ event })}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
