"use client";

import { format } from "date-fns";
import { HOURS } from "@/src/constant/calendar";
import { getDayColor, getDayEvents } from "@/src/utils/calendar";
import { useCalendarStore } from "@/src/hooks/stores/CalendarStore";
import CalendarCard from "../common/CalendarCard";
import { CalendarViewProps } from "@/src/types/calendar";
import { useIsHoliday } from "@/src/hooks/useIsHoliday";
import WeatherBadge from "./WeatherBadge";
import HourColumn from "./HourColumn";

export default function DayView({
  events,
  holidays,
  weathers,
}: CalendarViewProps) {
  const currentDate = useCalendarStore((s) => s.currentDate);
  const holiday = useIsHoliday(currentDate, holidays);

  const dateKey = format(currentDate, "yyyyMMdd");
  const targetWeather = weathers?.[dateKey];

  const getDayLayouts = getDayEvents(events, currentDate);

  return (
    <div className="h-full border border-divider bg-surface flex flex-col">
      <div
        className={`h-14 flex items-center gap-2 justify-center border-b border-divider typo-body-2 ${getDayColor(
          currentDate,
          holiday,
        )}`}
      >
        <span>{format(currentDate, "M월, d일 EEEE")}</span>
        <WeatherBadge targetWeather={targetWeather} />
      </div>

      <div className="flex-1 overflow-y-auto min-h-0">
        <div className="grid grid-cols-[60px_1fr] min-h-[1400px]">
          <HourColumn />

          <div className="relative">
            {HOURS.map((_, i) => (
              <div key={i} className="h-14 border-b border-divider" />
            ))}
            {getDayLayouts.map((layout) => (
              <CalendarCard
                key={`${layout.event.id}-${layout.date.getTime()}`}
                event={layout.event}
                date={layout.date}
                top={layout.top}
                height={layout.height}
                width={layout.width}
                left={layout.left}
                variant="day"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
