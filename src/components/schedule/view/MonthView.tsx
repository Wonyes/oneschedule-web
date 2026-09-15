"use client";

import { useMemo, useState } from "react";
import { format, isSameDay, isSameMonth } from "date-fns";
import { ko } from "date-fns/locale";
import { Plus } from "lucide-react";
import {
  findHoliday,
  getDayColor,
  getMonthDates,
  getMonthWeekLanes,
  getSortedDayEvents,
} from "@/src/utils/schedule";
import ScheduleCard from "../components/ScheduleCard";
import { useScheduleStore } from "@/src/hooks/stores/useScheduleStore";
import { useScheduleView } from "@/src/hooks/useScheduleView";
import { ScheduleViewProps } from "@/src/types/schedule";
import WeatherBadge from "../components/WeatherBadge";
import { useSheetStore } from "@/src/hooks/stores/useSheetStore";
import { useSwipe } from "@/src/hooks/useSwipe";

const WEEKDAY_LABELS = ["일", "월", "화", "수", "목", "금", "토"];

export default function MonthView({
  events,
  holidays,
  weathers,
  isWeatherLoading,
}: ScheduleViewProps) {
  const currentDate = useScheduleStore((s) => s.currentDate);
  const next = useScheduleStore((s) => s.next);
  const prev = useScheduleStore((s) => s.prev);
  const setMode = useScheduleStore((s) => s.setMode);
  const setCurrentDate = useScheduleStore((s) => s.setCurrentDate);
  const monthDates = getMonthDates(currentDate);
  const { viewType } = useScheduleView();
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

  // 주 단위로 줄을 배정해서 여러 날짜에 걸친 일정이 같은 줄에 이어지게 한다.
  const weekLanes = useMemo(() => {
    const byDate = new Map<
      number,
      ReturnType<typeof getMonthWeekLanes>[number]
    >();
    for (let i = 0; i < monthDates.length; i += 7) {
      const week = monthDates.slice(i, i + 7);
      getMonthWeekLanes(events, week).forEach((lanes, j) =>
        byDate.set(week[j].getTime(), lanes),
      );
    }
    return byDate;
  }, [events, monthDates]);

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <div className="hidden min-h-0 flex-1 flex-col sm:flex sm:overflow-x-auto">
        <div className="min-w-[560px] flex flex-col flex-1 min-h-0">
          <div className="grid grid-cols-7 shrink-0 px-2 pt-3">
              {WEEKDAY_LABELS.map((d, i) => (
                <div
                  key={d}
                  className={`flex h-8 items-center justify-center typo-caption-3 font-semibold tracking-wide ${
                    i === 0
                      ? "text-error-500"
                      : i === 6
                        ? "text-blue"
                        : "text-muted"
                  }`}
                >
                  {d}
                </div>
              ))}
          </div>

          <div className="flex-1 overflow-y-auto min-h-0 p-2">
            <div
              className="grid min-h-full grid-cols-7 gap-1.5 rounded-2xl neu-pressed p-1.5"
              style={{ gridTemplateRows: `repeat(${monthDates.length / 7}, minmax(0, 1fr))` }}
            >
              {monthDates.map((date) => {
                const inCurrentMonth = isSameMonth(date, currentDate);
                const isHoliday = findHoliday(date, holidays);

                const dateKey = format(date, "yyyyMMdd");
                const targetWeather = weathers?.[dateKey];

                const MAX_VISIBLE_EVENTS = 2;
                const lanes = weekLanes.get(date.getTime()) ?? [];
                const sortedDayEvents = lanes.filter((cell) => cell !== null);
                const visibleLanes = Array.from(
                  { length: Math.min(lanes.length, MAX_VISIBLE_EVENTS) },
                  (_, i) => lanes[i] ?? null,
                );
                const hiddenEventsCount = lanes
                  .slice(MAX_VISIBLE_EVENTS)
                  .filter((cell) => cell !== null).length;

                const hasEvents = sortedDayEvents.length > 0;
                const openDay = () => {
                  setCurrentDate(date);
                  setMode("day");
                };

                return (
                  <div
                    key={date.toISOString()}
                    role="button"
                    tabIndex={0}
                    aria-label={`${format(date, "M월 d일", { locale: ko })}${
                      hasEvents
                        ? ` 일정 ${sortedDayEvents.length}개 보기`
                        : " 일정 추가"
                    }`}
                    onClick={() =>
                      hasEvents
                        ? openDay()
                        : openSheet({ date, type: viewType })
                    }
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        if (hasEvents) openDay();
                        else openSheet({ date, type: viewType });
                      }
                    }}
                    className={`group relative cursor-pointer rounded-xl p-1 transition-[background-color,box-shadow] duration-200 hover:neu-flat ${
                      isSameDay(date, new Date())
                        ? "neu-flat"
                        : hasEvents
                          ? "bg-surface/50"
                          : ""
                    } ${inCurrentMonth ? "" : "opacity-40"}`}
                  >
                    {hasEvents && (
                      <button
                        type="button"
                        aria-label={`${format(date, "M월 d일", { locale: ko })}에 일정 추가`}
                        onClick={(e) => {
                          e.stopPropagation();
                          openSheet({ date, type: viewType });
                        }}
                        className="neu-btn btn-spring absolute right-1 top-1 z-20 flex h-6 w-6 items-center justify-center rounded-lg text-muted opacity-0 hover:text-accent focus-visible:opacity-100 group-hover:opacity-100"
                      >
                        <Plus size={12} strokeWidth={2.25} />
                      </button>
                    )}

                    <div className="flex h-8 items-center justify-left gap-2">
                      <span
                        className={`flex h-6 min-w-6 items-center justify-center px-1 typo-caption-2 tabular-nums ${
                          isSameDay(date, new Date())
                            ? "btn-primary rounded-lg font-semibold"
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

                    <div className="relative mt-1 flex flex-col gap-0.5">
                      {visibleLanes.map((cell, lane) =>
                        cell ? (
                          <ScheduleCard
                            key={`${cell.event.id}-${date.toISOString()}`}
                            event={cell.event}
                            date={date}
                            variant="month"
                            onClick={() => openSheet({ event: cell.event })}
                            className={`
                              ${!cell.isStart ? "ml-[-8px] rounded-l-none border-l-0" : ""}
                              ${!cell.isEnd ? "mr-[-8px] rounded-r-none border-r-0" : ""}
                              z-10
                            `}
                          />
                        ) : (
                          <div
                            key={`empty-${lane}`}
                            aria-hidden
                            className="h-[26px]"
                          />
                        ),
                      )}

                      {hiddenEventsCount > 0 && (
                        <div className="typo-caption-2 text-muted pl-1">
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
        <div className="grid grid-cols-7 shrink-0 px-2 pt-4">
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
              {format(selectedDate, "M월 d일 EEEE", { locale: ko })}
            </span>

            <button
              type="button"
              onClick={() => openSheet({ date: selectedDate, type: viewType })}
              className="flex h-8 w-8 items-center justify-center rounded-full text-muted transition hover:bg-muted/10 active:scale-95"
              aria-label="일정 추가"
            >
              <Plus size={16} />
            </button>
          </div>

          {selectedDateEvents.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-6">
              <p className="typo-caption-2 text-muted">이 날은 비어 있어요.</p>

              <button
                type="button"
                onClick={() =>
                  openSheet({ date: selectedDate, type: viewType })
                }
                className="btn-spring neu-btn text-secondary hover:text-foreground flex h-9 items-center gap-1.5 rounded-xl px-4 typo-caption-2 font-medium"
              >
                <Plus size={14} strokeWidth={2} />
                일정 추가
              </button>
            </div>
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
