"use client";

import { Timer } from "lucide-react";
import { format, isSameDay, addDays } from "date-fns";
import { useMemo } from "react";

import ScheduleCard from "../components/ScheduleCard";
import WeatherBadge from "../components/WeatherBadge";
import HourColumn from "../layout/HourColumn";
import TimeGrid from "../components/TimeGrid";
import BaseCard from "../../ui/card/BaseCard";
import NavButton from "../components/NavButton";

import { ScheduleViewProps } from "@/src/types/schedule";
import {
  findHoliday,
  getDayColor,
  getWeekDates,
  getWeekEvents,
} from "@/src/utils/schedule";

import { useScheduleStore } from "@/src/hooks/stores/useScheduleStore";
import { useSheetStore } from "@/src/hooks/stores/useSheetStore";

interface DayHeaderProps {
  date: Date;
  holidays: ScheduleViewProps["holidays"];
  weathers: ScheduleViewProps["weathers"];
  mobile?: boolean;
}

const DayHeader = ({
  date,
  holidays,
  weathers,
  mobile = false,
}: DayHeaderProps) => {
  const isHoliday = findHoliday(date, holidays);
  const dateKey = format(date, "yyyyMMdd");
  const targetWeather = weathers?.[dateKey];
  const isToday = isSameDay(date, new Date());

  return (
    <div className="flex h-full flex-col items-center justify-center gap-1">
      <div
        className={`flex items-center gap-1.5 ${
          mobile ? "text-sm" : "text-xs"
        } ${getDayColor(date, isHoliday)}`}
      >
        <span>{format(date, "EEE")}</span>
        <WeatherBadge targetWeather={targetWeather} />
      </div>

      <span
        className={`
          flex items-center justify-center rounded-full font-semibold
          ${mobile ? "h-8 w-8 text-base" : "h-6 w-6 text-xs"}
          ${isToday ? "bg-primary text-white" : getDayColor(date, isHoliday)}
        `}
      >
        {format(date, "d")}
      </span>
    </div>
  );
};

interface DayColumnProps {
  date: Date;
  layouts: ReturnType<typeof getWeekEvents>;
  onClickTime: (date: Date, startTime: string) => void;
}

const DayColumn = ({ date, layouts, onClickTime }: DayColumnProps) => {
  const dayLayouts = layouts.filter((layout) => isSameDay(layout.date, date));

  return (
    <div className="relative border-r border-divider/40 last:border-r-0">
      <TimeGrid onClickTime={(startTime) => onClickTime(date, startTime)} />

      {dayLayouts.map((layout) => (
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
};

interface MobileHeaderProps {
  dates: Date[];
  holidays: ScheduleViewProps["holidays"];
  weathers: ScheduleViewProps["weathers"];
  onPrevious: () => void;
  onNext: () => void;
}

const MobileHeader = ({
  dates,
  holidays,
  weathers,
  onPrevious,
  onNext,
}: MobileHeaderProps) => {
  return (
    <BaseCard className="shrink-0 px-3 py-3" glow>
      <div className="mb-3 flex items-center justify-between">
        <NavButton direction="prev" onClick={onPrevious} label="이전 주" />

        <div className="flex flex-col items-center">
          <span className="typo-body-2 font-semibold text-primary">
            {format(dates[0], "yyyy년 M월")}
          </span>

          <span className="mt-0.5 text-xs text-muted">
            {format(dates[0], "M월 d일")} -{" "}
            {format(dates[dates.length - 1], "M월 d일")}
          </span>
        </div>

        <NavButton direction="next" onClick={onNext} label="다음 주" />
      </div>

      <div className="grid grid-cols-3">
        {dates.map((date, index) => (
          <div
            key={date.toISOString()}
            className={
              index !== dates.length - 1 ? "border-r border-divider/40" : ""
            }
          >
            <DayHeader
              date={date}
              holidays={holidays}
              weathers={weathers}
              mobile
            />
          </div>
        ))}
      </div>
    </BaseCard>
  );
};

export default function WeekView({
  events,
  holidays,
  weathers,
}: ScheduleViewProps) {
  const currentDate = useScheduleStore((state) => state.currentDate);

  const setCurrentDate = useScheduleStore((state) => state.setCurrentDate);

  const { openSheet } = useSheetStore();

  const weekDates = useMemo(() => getWeekDates(currentDate), [currentDate]);

  const mobileDates = useMemo(() => {
    const index = weekDates.findIndex((date) => isSameDay(date, currentDate));

    if (index <= 0) {
      return weekDates.slice(0, 3);
    }

    if (index >= weekDates.length - 2) {
      return weekDates.slice(-3);
    }

    return weekDates.slice(index - 1, index + 2);
  }, [weekDates, currentDate]);

  const allWeekLayouts = useMemo(
    () => getWeekEvents(events, weekDates),
    [events, weekDates],
  );

  const handleClickTime = (date: Date, startTime: string) => {
    openSheet({
      date,
      startTime,
    });
  };

  const handleMobilePrevious = () => setCurrentDate(addDays(currentDate, -3));
  const handleMobileNext = () => setCurrentDate(addDays(currentDate, 3));

  return (
    <div className="h-full overflow-hidden rounded-3xl neu-flat">
      <div className="hidden h-full min-h-0 flex-col sm:flex">
        <div className="shrink-0 px-2.5">
          <BaseCard glow>
            <div
              className="
                grid h-14
                grid-cols-[60px_repeat(7,minmax(0,1fr))]
                border-b border-divider
              "
            >
              <div className="flex items-center justify-center border-r border-divider/40 text-muted">
                <Timer size={14} />
              </div>

              {weekDates.map((date) => (
                <div
                  key={date.toISOString()}
                  className="border-r border-divider/40 last:border-r-0"
                >
                  <DayHeader
                    date={date}
                    holidays={holidays}
                    weathers={weathers}
                  />
                </div>
              ))}
            </div>
          </BaseCard>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto p-2">
          <div
            className="
              grid min-h-full
              grid-cols-[60px_repeat(7,minmax(0,1fr))]
              overflow-hidden
              rounded-2xl
              neu-pressed
            "
          >
            <HourColumn />

            {weekDates.map((date) => (
              <DayColumn
                key={date.toISOString()}
                date={date}
                layouts={allWeekLayouts}
                onClickTime={handleClickTime}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="flex h-full min-h-0 flex-col sm:hidden">
        <MobileHeader
          dates={mobileDates}
          holidays={holidays}
          weathers={weathers}
          onPrevious={handleMobilePrevious}
          onNext={handleMobileNext}
        />

        <div className="min-h-0 flex-1 overflow-x-auto overflow-y-auto p-2">
          <div
            className="
              grid min-h-full
              min-w-[382px]
              grid-cols-[52px_repeat(3,minmax(110px,1fr))]
              overflow-hidden
              rounded-2xl
              neu-pressed
            "
          >
            <HourColumn />

            {mobileDates.map((date) => (
              <DayColumn
                key={date.toISOString()}
                date={date}
                layouts={allWeekLayouts}
                onClickTime={handleClickTime}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
