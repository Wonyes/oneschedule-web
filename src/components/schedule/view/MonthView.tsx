"use client";

import { useMemo, useState } from "react";
import { format, isSameDay, isSameMonth } from "date-fns";
import { Plus } from "lucide-react";
import {
  findHoliday,
  getDayColor,
  getMonthDates,
  getSortedDayEvents,
  isSameDate,
} from "@/src/utils/schedule";
import ScheduleCard from "../components/ScheduleCard";
import { useScheduleStore } from "@/src/hooks/stores/useScheduleStore";
import { ScheduleViewProps } from "@/src/types/schedule";
import WeatherBadge from "../components/WeatherBadge";
import { useSheetStore } from "@/src/hooks/stores/useSheetStore";
import BaseCard from "../../ui/card/BaseCard";
import { useSwipe } from "@/src/hooks/useSwipe";
import NavButton from "../components/NavButton";

const WEEKDAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function MonthView({
  events,
  holidays,
  weathers,
  isWeatherLoading,
}: ScheduleViewProps) {
  const currentDate = useScheduleStore((s) => s.currentDate);
  const next = useScheduleStore((s) => s.next);
  const prev = useScheduleStore((s) => s.prev);
  const monthDates = getMonthDates(currentDate);
  const { openSheet } = useSheetStore();

  const [selectedDate, setSelectedDate] = useState(currentDate);
  const [prevCurrentDate, setPrevCurrentDate] = useState(currentDate);

  if (currentDate !== prevCurrentDate) {
    setPrevCurrentDate(currentDate);
    setSelectedDate(currentDate);
  }

  const selectedDateEvents = useMemo(
    () => getSortedDayEvents(events, selectedDate),
    [events, selectedDate],
  );

  const swipeHandlers = useSwipe(next, prev);

  return (
    <div className="h-full neu-flat rounded-3xl flex flex-col overflow-hidden">
      <BaseCard
        className="shrink-0 px-3 py-1 sm:hidden"
        childClass="flex items-center justify-between"
        glow
      >
        <NavButton direction="prev" onClick={prev} label="이전 달" />

        <span className="typo-body-2 font-semibold text-primary">
          {format(currentDate, "yyyy년 M월")}
        </span>

        <NavButton direction="next" onClick={next} label="다음 달" />
      </BaseCard>

      <div className="hidden min-h-0 flex-1 flex-col sm:flex sm:overflow-x-auto">
        <div className="min-w-[560px] flex flex-col flex-1 min-h-0">
          <BaseCard glow>
            <div className="grid grid-cols-7 border-b border-divider shrink-0">
              {WEEKDAY_LABELS.map((d) => (
                <div
                  key={d}
                  className="h-10 flex items-center justify-center text-xs text-muted"
                >
                  {d}
                </div>
              ))}
            </div>
          </BaseCard>

          <div className="flex-1 overflow-y-auto min-h-0 p-2">
            <div className="grid grid-cols-7 grid-rows-6 min-h-full neu-pressed rounded-2xl overflow-hidden">
              {monthDates.map((date) => {
                const inCurrentMonth = isSameMonth(date, currentDate);
                const isHoliday = findHoliday(date, holidays);

                const dateKey = format(date, "yyyyMMdd");
                const targetWeather = weathers?.[dateKey];

                const sortedDayEvents = getSortedDayEvents(events, date);

                const MAX_VISIBLE_EVENTS = 2;
                const visibleEvents = sortedDayEvents.slice(
                  0,
                  MAX_VISIBLE_EVENTS,
                );
                const hiddenEventsCount =
                  sortedDayEvents.length - MAX_VISIBLE_EVENTS;

                return (
                  <div
                    key={date.toISOString()}
                    onClick={() => openSheet({ date })}
                    className={`border-r border-b border-divider/40 p-1 cursor-pointer hover:bg-surface/40 transition-colors ${
                      inCurrentMonth ? "" : "opacity-40"
                    }`}
                  >
                    <div className="flex h-8 items-center justify-left gap-2">
                      <span
                        className={`flex h-5 w-5 items-center justify-center rounded-full text-xs ${
                          isSameDay(date, new Date())
                            ? "bg-primary text-on-primary"
                            : getDayColor(date, isHoliday)
                        }`}
                      >
                        {format(date, "d")}
                      </span>

                      <WeatherBadge
                        targetWeather={targetWeather}
                        isLoading={isWeatherLoading}
                      />
                    </div>

                    <div className="relative h-full flex flex-col gap-0.5 mt-1">
                      {visibleEvents.map((event) => {
                        const start = new Date(event.startDate);
                        const end = new Date(event.endDate);
                        const isStartOfDay = isSameDate(start, date);
                        const isEndOfDay = isSameDate(end, date);

                        return (
                          <ScheduleCard
                            key={`${event.id}-${date.toISOString()}`}
                            event={event}
                            date={date}
                            variant="month"
                            onClick={() => openSheet({ event })}
                            className={`
                              ${!isStartOfDay ? "ml-[-8px] rounded-l-none border-l-0" : ""}
                              ${!isEndOfDay ? "mr-[-8px] rounded-r-none border-r-0" : ""}
                              z-10
                            `}
                          />
                        );
                      })}

                      {hiddenEventsCount > 0 && (
                        <div className="typo-caption-2 text-muted pl-1 cursor-pointer hover:underline">
                          + {hiddenEventsCount}개 더보기
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div
        className="flex min-h-0 flex-1 flex-col overflow-y-auto sm:hidden"
        {...swipeHandlers}
      >
        <div className="grid grid-cols-7 shrink-0 px-2 pt-1.5">
          {WEEKDAY_LABELS.map((d) => (
            <div
              key={d}
              className="h-4 flex items-center justify-center text-[11px] text-muted"
            >
              {d}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 shrink-0 px-2 pb-1.5">
          {monthDates.map((date) => {
            const inCurrentMonth = isSameMonth(date, currentDate);
            const isHoliday = findHoliday(date, holidays);
            const isSelected = isSameDay(date, selectedDate);
            const isToday = isSameDay(date, new Date());
            const dotEvents = getSortedDayEvents(events, date).slice(0, 3);

            const dateKey = format(date, "yyyyMMdd");
            const targetWeather = weathers?.[dateKey];

            return (
              <button
                type="button"
                key={date.toISOString()}
                onClick={() => setSelectedDate(date)}
                className={`flex flex-col items-center gap-0.5 py-0.5 transition-transform active:scale-95 ${
                  inCurrentMonth ? "" : "opacity-40"
                }`}
              >
                <span
                  className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium transition-colors ${
                    isSelected
                      ? "bg-primary text-on-primary"
                      : isToday
                        ? "border border-primary text-primary"
                        : getDayColor(date, isHoliday)
                  }`}
                >
                  {format(date, "d")}
                </span>

                <span className="flex h-2 items-center gap-0.5">
                  <WeatherBadge
                    targetWeather={targetWeather}
                    isLoading={isWeatherLoading}
                    iconOnly
                  />

                  {dotEvents.map((event) => (
                    <span
                      key={event.id}
                      className="h-1 w-1 rounded-full bg-primary"
                      aria-hidden="true"
                    />
                  ))}
                </span>
              </button>
            );
          })}
        </div>

        <div className="shrink-0 border-t border-divider px-3 py-3">
          <div className="mb-2 flex items-center justify-between">
            <span className="typo-body-2 font-semibold text-primary">
              {format(selectedDate, "M월 d일 EEEE")}
            </span>

            <button
              type="button"
              onClick={() => openSheet({ date: selectedDate })}
              className="flex h-8 w-8 items-center justify-center rounded-full text-muted transition hover:bg-muted/10 active:scale-95"
              aria-label="일정 추가"
            >
              <Plus size={16} />
            </button>
          </div>

          {selectedDateEvents.length === 0 ? (
            <p className="typo-caption-2 text-muted py-6 text-center">
              일정이 없습니다.
            </p>
          ) : (
            <div className="flex flex-col gap-2">
              {selectedDateEvents.map((event) => (
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
    </div>
  );
}
