"use client";

import { format, isSameMonth } from "date-fns";
import {
  findHoliday,
  getDayColor,
  getMonthDates,
  getWeatherIcon,
  isSameDate,
} from "@//utils/calendar";
import CalendarCard from "../common/CalendarCard";
import { dummyEvents } from "./WeekView";
import { useCalendarStore } from "@//hooks/stores/CalendarStore";
import { holidayType, ProcessedWeather } from "@//types/calendar";

export default function MonthView({
  holidays,
  weathers,
}: {
  holidays: holidayType[];
  weathers: ProcessedWeather | undefined;
}) {
  const currentDate = useCalendarStore((s) => s.currentDate);
  const monthDates = getMonthDates(currentDate);

  return (
    <div className="h-full border border-divider bg-surface grid grid-rows-[auto_1fr]">
      <div className="grid grid-cols-7 border-b border-divider">
        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
          <div
            key={d}
            className="h-10 flex items-center justify-center text-xs text-muted"
          >
            {d}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 grid-rows-6">
        {monthDates.map((date) => {
          const inCurrentMonth = isSameMonth(date, currentDate);
          const isHoliday = findHoliday(date, holidays);

          const dateKey = format(date, "yyyyMMdd");
          const targetWeather = weathers?.[dateKey];

          const dayEvents = dummyEvents.filter((e) => {
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
              new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
            );
          });

          const MAX_VISIBLE_EVENTS = 2;
          const visibleEvents = sortedDayEvents.slice(0, MAX_VISIBLE_EVENTS);
          const hiddenEventsCount = sortedDayEvents.length - MAX_VISIBLE_EVENTS;

          return (
            <div
              key={date.toISOString()}
              className={`border-r border-b border-divider p-1 ${
                inCurrentMonth ? "" : "opacity-40"
              }`}
            >
              <div className="flex h-8 items-center justify-left gap-2">
                <span className={`text-xs ${getDayColor(date, isHoliday)}`}>
                  {format(date, "d")}
                </span>

                {targetWeather ? (
                  <div>
                    <span>
                      {getWeatherIcon(targetWeather.PTY, targetWeather.SKY)}
                    </span>
                    <span className="text-[12px] text-muted">
                      {targetWeather.TMP}°
                    </span>
                  </div>
                ) : null}
              </div>

              <div className="flex flex-col gap-0.5 mt-1">
                {visibleEvents.map((event) => {
                  const start = new Date(event.startDate);
                  const end = new Date(event.endDate);
                  const isStartOfDay = isSameDate(start, date);
                  const isEndOfDay = isSameDate(end, date);

                  return (
                    <CalendarCard
                      key={`${event.id}-${date.toISOString()}`}
                      event={event}
                      date={date}
                      variant="compact"
                      className={`
                         ${!isStartOfDay ? "ml-[-8px] rounded-l-none border-l-0" : ""} 
                         ${!isEndOfDay ? "mr-[-8px] rounded-r-none border-r-0" : ""}
                         z-10
                        `}
                    />
                  );
                })}

                {hiddenEventsCount > 0 && (
                  <div className="typo-caption-1 text-gray-500 pl-1 cursor-pointer hover:underline">
                    + {hiddenEventsCount}개 더보기
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
