"use client";

import { format, isSameMonth } from "date-fns";
import {
  findHoliday,
  getDayColor,
  getMonthDates,
  isSameDate,
} from "@/src/utils/schedule";
import ScheduleCard from "../components/ScheduleCard";
import { useScheduleStore } from "@/src/hooks/stores/useScheduleStore";
import { ScheduleViewProps } from "@/src/types/schedule";
import WeatherBadge from "../components/WeatherBadge";
import { useSheetStore } from "@/src/hooks/stores/useSheetStore";
import BaseCard from "../../ui/card/BaseCard";

export default function MonthView({
  events,
  holidays,
  weathers,
}: ScheduleViewProps) {
  const currentDate = useScheduleStore((s) => s.currentDate);
  const monthDates = getMonthDates(currentDate);
  const { openSheet } = useSheetStore();

  return (
    <div className="h-full neu-flat rounded-3xl flex flex-col overflow-hidden">
      <BaseCard glow>
        <div className="grid grid-cols-7 border-b border-divider shrink-0">
          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
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
        <div className="grid grid-cols-6 grid-rows-6 min-h-full neu-pressed rounded-2xl overflow-hidden">
          {monthDates.map((date) => {
            const inCurrentMonth = isSameMonth(date, currentDate);
            const isHoliday = findHoliday(date, holidays);

            const dateKey = format(date, "yyyyMMdd");
            const targetWeather = weathers?.[dateKey];

            const dayEvents = events.filter((e) => {
              const start = new Date(e.startDate).setHours(0, 0, 0, 0);
              const end = new Date(e.endDate).setHours(23, 59, 59, 999);
              const target = date.getTime();
              return target >= start && target <= end;
            });

            const sortedDayEvents = [...dayEvents].sort((a, b) => {
              const durationA =
                new Date(a.endDate).getTime() - new Date(a.startDate).getTime();
              const durationB =
                new Date(b.endDate).getTime() - new Date(b.startDate).getTime();

              if (durationB !== durationA) {
                return durationB - durationA;
              }

              return (
                new Date(a.startDate).getTime() -
                new Date(b.startDate).getTime()
              );
            });

            const MAX_VISIBLE_EVENTS = 2;
            const visibleEvents = sortedDayEvents.slice(0, MAX_VISIBLE_EVENTS);
            const hiddenEventsCount =
              sortedDayEvents.length - MAX_VISIBLE_EVENTS;

            return (
              <div
                key={date.toISOString()}
                onClick={() =>
                  openSheet({
                    date,
                  })
                }
                className={`border-r border-b border-divider/40 p-1 cursor-pointer hover:bg-surface/40 transition-colors ${
                  inCurrentMonth ? "" : "opacity-40"
                }`}
              >
                <div className="flex h-8 items-center justify-left gap-2">
                  <span className={`text-xs ${getDayColor(date, isHoliday)}`}>
                    {format(date, "d")}
                  </span>

                  <WeatherBadge targetWeather={targetWeather} />
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
                        className={`
                          ${!isStartOfDay ? "ml-[-8px] rounded-l-none border-l-0" : ""} 
                          ${!isEndOfDay ? "mr-[-8px] rounded-r-none border-r-0" : ""}
                          z-10
                        `}
                      />
                    );
                  })}

                  {hiddenEventsCount > 0 && (
                    <div className="typo-caption-2 text-gray-500 pl-1 cursor-pointer hover:underline">
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
  );
}
