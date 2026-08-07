"use client";

import { format } from "date-fns";
import { getDayColor, getDayEvents } from "@/src/utils/schedule";
import { useScheduleStore } from "@/src/hooks/stores/useScheduleStore";
import ScheduleCard from "../components/ScheduleCard";
import { ScheduleViewProps } from "@/src/types/schedule";
import { useIsHoliday } from "@/src/hooks/useIsHoliday";
import WeatherBadge from "../components/WeatherBadge";
import HourColumn from "../layout/HourColumn";
import { HOURS } from "@/src/constant/schedule";
import { useSheetStore } from "@/src/hooks/stores/useSheetStore";
import BaseCard from "../../ui/card/BaseCard";
import { Column } from "../../ui/layout/flex";

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
    <div className="h-full neu-flat rounded-3xl flex flex-col overflow-hidden">
      <BaseCard
        className={`h-14 shrink-0 flex flex-col items-center text-center gap-2 justify-center border-b border-divider typo-body-2 
          ${getDayColor(currentDate, holiday)}`}
        glow
      >
        <Column className="items-center">
          <span>{format(currentDate, "M월, d일 EEEE")}</span>
          <WeatherBadge targetWeather={targetWeather} />
        </Column>
      </BaseCard>

      <div className="flex-1 overflow-y-auto min-h-0 p-2">
        <div className="grid grid-cols-[60px_1fr] min-h-full neu-pressed rounded-2xl">
          <HourColumn />

          <div className="relative">
            {HOURS.map((hour, i) => (
              <div
                key={i}
                onClick={() =>
                  openSheet({
                    date: currentDate,
                    startTime: hour,
                  })
                }
                className="h-[56px] border-b border-divider/40 box-border hover:bg-surface/40 transition-colors cursor-pointer"
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
