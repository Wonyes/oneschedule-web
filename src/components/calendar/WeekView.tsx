"use client";

import { Timer } from "lucide-react";
import { format } from "date-fns";

import { CalendarViewProps } from "@//types/calendar";
import {
  findHoliday,
  getDayColor,
  getWeekDates,
  getWeekEvents,
} from "@//utils/calendar";
import { useCalendarStore } from "@//hooks/stores/CalendarStore";
import CalendarCard from "../common/CalendarCard";
import WeatherBadge from "./WeatherBadge";
import HourColumn from "./HourColumn";
import TimeGrid from "./TimeGrid";

export default function WeekView({
  events,
  holidays,
  weathers,
}: CalendarViewProps) {
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
                  <WeatherBadge targetWeather={targetWeather} />
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
          <HourColumn />

          {weekDates.map((date) => {
            const weekEvents = getWeekEvents(events, date);
            return (
              <div
                key={date.toISOString()}
                className="relative border-r border-divider"
              >
                <TimeGrid />

                {weekEvents.map((layout) => (
                  <CalendarCard
                    key={`${layout.event.id}-${layout.date.toISOString()}`}
                    event={layout.event}
                    top={layout.top}
                    height={layout.height}
                    date={layout.date}
                  />
                ))}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
