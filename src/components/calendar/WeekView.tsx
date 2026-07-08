"use client";

import { Timer } from "lucide-react";
import { format, isSameDay } from "date-fns";

import { HOURS } from "@/constant/calendar";
import {
  CalendarEvent,
  holidayType,
  ProcessedWeather,
} from "@//types/calendar";
import {
  findHoliday,
  getDayColor,
  getEventPosition,
  getWeatherIcon,
  getWeekDates,
} from "@//utils/calendar";
import { useCalendarStore } from "@//hooks/stores/CalendarStore";
import CalendarCard from "../common/CalendarCard";

export const dummyEvents: CalendarEvent[] = [
  {
    id: 1,
    title: "Frontend Meeting",
    startDate: "2026-07-16T11:00:00",
    endDate: "2026-07-16T13:00:00",
    category: "meeting",
  },
  {
    id: 2,
    title: "Project Work",
    startDate: "2026-07-15T09:30:00",
    endDate: "2026-07-15T11:30:00",
    category: "work",
  },
  {
    id: 3,
    title: "Gym",
    startDate: "2026-07-08T18:00:00",
    endDate: "2026-07-19T19:30:00",
    category: "personal",
  },
];

export default function WeekView({
  holidays,
  weathers,
}: {
  holidays: holidayType[];
  weathers: ProcessedWeather | undefined;
}) {
  const currentDate = useCalendarStore((s) => s.currentDate);
  const weekDates = getWeekDates(currentDate);

  return (
    <div className="h-full border border-divider bg-surface flex flex-col">
      <div className="pr-2.5">
        <div className="grid grid-cols-[60px_repeat(7,minmax(0,1fr))] h-14 shrink-0 bg-back border-b border-divider">
          <div className="flex items-center justify-center border-r border-divider text-muted">
            <Timer size={14} />
          </div>

          {weekDates.map((date, i) => {
            const isHoliday = findHoliday(date, holidays);

            const dateKey = format(date, "yyyyMMdd");
            const targetWeather = weathers?.[dateKey];

            return (
              <div
                key={date.toISOString()}
                className={`flex flex-col items-center justify-center typo-body-2 text-secondarty
              ${i !== weekDates.length - 1 ? "border-r border-divider" : ""}`}
              >
                <div className="flex gap-2 items-center">
                  <span className={getDayColor(date, isHoliday)}>
                    {format(date, "EEE")}
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
                <span
                  className={`text-xs text-muted ${getDayColor(date, isHoliday)}`}
                >
                  {format(date, "d")}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex-1 scroll-stable overflow-y-auto min-h-0">
        <div className="grid grid-cols-[60px_repeat(7,1fr)] min-h-[1344px]">
          <div className="bg-main-bg border-r border-divider">
            {HOURS.map((hour) => (
              <div
                key={hour}
                className="h-14 flex items-center justify-center text-[11px] text-muted border-b border-divider"
              >
                {hour}
              </div>
            ))}
          </div>

          {weekDates.map((date) => (
            <div
              key={date.toISOString()}
              className="relative border-r border-divider"
            >
              {HOURS.map((_, i) => (
                <div key={i} className="h-14 border-b border-divider" />
              ))}

              {dummyEvents
                .filter((event) => {
                  const start = new Date(event.startDate);
                  const end = new Date(event.endDate);
                  return (
                    date >= new Date(start.setHours(0, 0, 0, 0)) &&
                    date <= new Date(end.setHours(23, 59, 59, 999))
                  );
                })
                .map((event) => {
                  const isStart = isSameDay(new Date(event.startDate), date);
                  const position = getEventPosition(
                    event.startDate,
                    event.endDate,
                    date,
                  );
                  const top = isStart ? position.top : 0;
                  const height =
                    isStart || isSameDay(new Date(event.endDate), date)
                      ? position.height
                      : 1344;

                  return (
                    <CalendarCard
                      key={`${event.id}-${date.toISOString()}`}
                      event={event}
                      top={top}
                      height={height}
                      date={date}
                    />
                  );
                })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
