"use client";

import { format } from "date-fns";
import { getDayColor, getDayEvents } from "@/src/utils/Schedule";
import { useScheduleStore } from "@/src/hooks/stores/useScheduleStore";
import ScheduleCard from "../components/ScheduleCard";
import { ScheduleViewProps } from "@/src/types/schedule";
import { useIsHoliday } from "@/src/hooks/useIsHoliday";
import WeatherBadge from "../components/WeatherBadge";
import HourColumn from "../layout/HourColumn";
import { HOURS } from "@/src/constant/schedule";
import { useSheetStore } from "@/src/hooks/stores/useSheetStore";

export default function DayView({
  events,
  holidays,
  weathers,
}: ScheduleViewProps) {
  const currentDate = useScheduleStore((s) => s.currentDate);
  const holiday = useIsHoliday(currentDate, holidays);
  const { openSheet } = useSheetStore();

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
        <div className="grid grid-cols-[60px_1fr] h-full">
          <HourColumn />

          <div className="relative pb-16">
            {HOURS.map((hour, i) => (
              <div
                key={i}
                onClick={() =>
                  openSheet({
                    date: currentDate,
                    startTime: hour,
                  })
                }
                className="h-[56px] border-b border-divider box-border"
              />
            ))}
            {getDayLayouts.map((layout) => (
              <ScheduleCard
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
