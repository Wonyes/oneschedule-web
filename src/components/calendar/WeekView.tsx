"use client";

import { Timer } from "lucide-react";
import { format } from "date-fns";

import CalendarCard from "../common/CalendarCard";
import WeatherBadge from "./WeatherBadge";
import HourColumn from "./HourColumn";
import TimeGrid from "./TimeGrid";
import { useMemo } from "react";
import { CalendarViewProps } from "@/src/types/calendar";
import {
  findHoliday,
  getDayColor,
  getWeekDates,
  getWeekEvents,
} from "@/src/utils/calendar";
import { useCalendarStore } from "@/src/hooks/stores/CalendarStore";

interface WeeksType {
  weekDates: Date[];
  holidays: CalendarViewProps["holidays"];
  weathers: CalendarViewProps["weathers"];
}

const Weeks = ({ weekDates, holidays, weathers }: WeeksType) => {
  return (
    <>
      {weekDates.map((date: Date, i: number) => {
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
    </>
  );
};

export default function WeekView({
  events,
  holidays,
  weathers,
}: CalendarViewProps) {
  const currentDate = useCalendarStore((s) => s.currentDate);
  const weekDates = getWeekDates(currentDate);

  const allWeekLayouts = useMemo(
    () => getWeekEvents(events, weekDates),
    [events, weekDates],
  );

  return (
    <div className="h-full border border-divider bg-surface flex flex-col">
      <div className="pr-2.5">
        <div className="grid grid-cols-[60px_repeat(7,minmax(0,1fr))] h-14 shrink-0 bg-back border-b border-divider">
          <div className="flex items-center justify-center border-r border-divider text-muted">
            <Timer size={14} />
          </div>

          <Weeks
            weekDates={weekDates}
            holidays={holidays}
            weathers={weathers}
          />
        </div>
      </div>

      <div className="flex-1 scroll-stable overflow-y-auto min-h-0">
        <div className="grid grid-cols-[60px_repeat(7,1fr)] min-h-[1344px]">
          <HourColumn />

          {weekDates.map((date) => {
            return (
              <div
                key={date.toISOString()}
                className="relative border-r border-divider"
              >
                <TimeGrid />

                {allWeekLayouts.map((layout) => (
                  <CalendarCard
                    key={`${layout.event.id}-${layout.date.toISOString()}`}
                    event={layout.event}
                    top={layout.top}
                    height={layout.height}
                    date={layout.date}
                    width={layout.width}
                    left={layout.left}
                    variant="week"
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
