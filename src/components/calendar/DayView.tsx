"use client";

import { format, isSameDay } from "date-fns";
import { HOURS } from "@//constant/calendar";
import {
  getDayColor,
  getEventPosition,
  getWeatherIcon,
  splitEventByDate,
} from "@//utils/calendar";
import { dummyEvents } from "./WeekView";
import { useCalendarStore } from "@//hooks/stores/CalendarStore";
import CalendarCard from "../common/CalendarCard";
import {
  CalendarEvent,
  holidayType,
  ProcessedWeather,
} from "@//types/calendar";
import { useIsHoliday } from "@//hooks/useIsHoliday";

export default function DayView({
  holidays,
  weathers,
}: {
  holidays: holidayType[];
  weathers: ProcessedWeather | undefined;
}) {
  const currentDate = useCalendarStore((s) => s.currentDate);
  const holiday = useIsHoliday(currentDate, holidays);

  const dateKey = format(currentDate, "yyyyMMdd");
  const targetWeather = weathers?.[dateKey];

  console.log("Current Key:", dateKey);
  console.log(
    "Available Weather Keys:",
    weathers ? Object.keys(weathers) : "No data",
  );
  console.log("Target Weather:", targetWeather);

  return (
    <div className="h-full border border-divider bg-surface flex flex-col">
      <div
        className={`h-14 flex items-center gap-2 justify-center border-b border-divider typo-body-2 ${getDayColor(
          currentDate,
          holiday,
        )}`}
      >
        <span>{format(currentDate, "M월, d일 EEEE")}</span>
        {targetWeather ? (
          <div>
            <span>{getWeatherIcon(targetWeather.PTY, targetWeather.SKY)}</span>
            <span className="text-[12px] text-muted">{targetWeather.TMP}°</span>
          </div>
        ) : null}
      </div>

      <div className="flex-1 overflow-y-auto min-h-0">
        <div className="grid grid-cols-[60px_1fr] min-h-[1344px]">
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

          <div className="relative">
            {HOURS.map((_, i) => (
              <div key={i} className="h-14 border-b border-divider" />
            ))}
            {dummyEvents
              .filter(
                (e) =>
                  isSameDay(new Date(e.startDate), currentDate) ||
                  isSameDay(new Date(e.endDate), currentDate),
              )
              .flatMap((event) => splitEventByDate(event))
              .filter(
                (e) =>
                  isSameDay(new Date(e.startDate), currentDate) ||
                  isSameDay(new Date(e.endDate), currentDate),
              )
              .map((segment) => {
                const { top, height } = getEventPosition(
                  segment.displayStart,
                  segment.displayEnd,
                  currentDate,
                );

                return (
                  <CalendarCard
                    key={`${segment.id}-${segment.displayStart.getTime()}`}
                    event={segment as unknown as CalendarEvent}
                    date={currentDate}
                    top={top}
                    height={height}
                    className="rounded-[8px] border"
                  />
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
}
