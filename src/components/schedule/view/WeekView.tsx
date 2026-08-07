"use client";

import { Timer } from "lucide-react";
import { format } from "date-fns";

import ScheduleCard from "../components/ScheduleCard";
import WeatherBadge from "../components/WeatherBadge";
import HourColumn from "../layout/HourColumn";
import TimeGrid from "../components/TimeGrid";
import { useMemo } from "react";
import { ScheduleViewProps } from "@/src/types/schedule";
import {
  findHoliday,
  getDayColor,
  getWeekDates,
  getWeekEvents,
} from "@/src/utils/schedule";
import { useScheduleStore } from "@/src/hooks/stores/useScheduleStore";
import { useSheetStore } from "@/src/hooks/stores/useSheetStore";
import BaseCard from "../../ui/card/BaseCard";

interface WeeksType {
  weekDates: Date[];
  holidays: ScheduleViewProps["holidays"];
  weathers: ScheduleViewProps["weathers"];
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
            className={`flex flex-col items-center justify-center typo-body-2 text-secondary ${
              i !== weekDates.length - 1 ? "border-r border-divider/40" : ""
            }`}
          >
            <div className="flex gap-1.5 items-center">
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
}: ScheduleViewProps) {
  const currentDate = useScheduleStore((s) => s.currentDate);
  const weekDates = getWeekDates(currentDate);

  const { openSheet } = useSheetStore();

  const allWeekLayouts = useMemo(
    () => getWeekEvents(events, weekDates),
    [events, weekDates],
  );

  return (
    <div className="h-full neu-flat rounded-3xl flex flex-col overflow-hidden">
      <BaseCard className="pr-2.5 shrink-0" glow>
        <div className="grid grid-cols-[60px_repeat(7,minmax(0,1fr))] h-14 bg-transparent border-b border-divider">
          <div className="flex items-center justify-center border-r border-divider/40 text-muted">
            <Timer size={14} />
          </div>

          <Weeks
            weekDates={weekDates}
            holidays={holidays}
            weathers={weathers}
          />
        </div>
      </BaseCard>

      <div className="flex-1 overflow-y-auto min-h-0 p-2">
        <div className="grid grid-cols-[60px_repeat(7,1fr)] min-h-full neu-pressed rounded-2xl">
          <HourColumn />

          {weekDates.map((date, i) => {
            return (
              <div
                key={date.toISOString()}
                className={`relative ${
                  i !== weekDates.length - 1 ? "border-r border-divider/40" : ""
                }`}
              >
                <TimeGrid
                  onClickTime={(startTime) =>
                    openSheet({
                      date,
                      startTime,
                    })
                  }
                />

                {allWeekLayouts.map((layout) => (
                  <ScheduleCard
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
