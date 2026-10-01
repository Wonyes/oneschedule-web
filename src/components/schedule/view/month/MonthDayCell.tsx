"use client";

import { format, isSameDay } from "date-fns";
import { ko } from "date-fns/locale";
import { Plus } from "lucide-react";

import WeatherBadge from "@/src/components/common/weather/WeatherBadge";
import { holidayType, WeatherData } from "@/src/types/schedule";
import { findHoliday, getDayColor, MonthLaneCell } from "@/src/utils/schedule";
import { cn } from "@/src/utils/cn";
import ScheduleCard from "../../parts/card/ScheduleCard";

const MAX_VISIBLE = 2;

/** 데스크톱 월뷰 날짜 칸. 일정이 있으면 일뷰로, 없으면 시트 열기 */
export default function MonthDayCell({
  date,
  lanes,
  inCurrentMonth,
  holidays,
  weather,
  isWeatherLoading,
  onOpenDay,
  onAdd,
  onOpenEvent,
}: {
  date: Date;
  lanes: (MonthLaneCell | null)[];
  inCurrentMonth: boolean;
  holidays: holidayType[];
  weather?: WeatherData;
  isWeatherLoading?: boolean;
  onOpenDay: (date: Date) => void;
  onAdd: (date: Date) => void;
  onOpenEvent: (cell: MonthLaneCell) => void;
}) {
  const isToday = isSameDay(date, new Date());
  const holiday = findHoliday(date, holidays);
  const eventCount = lanes.filter((cell) => cell !== null).length;
  const hasEvents = eventCount > 0;
  const visible = lanes.slice(0, MAX_VISIBLE);
  const hidden = lanes
    .slice(MAX_VISIBLE)
    .filter((cell) => cell !== null).length;
  const label = format(date, "M월 d일", { locale: ko });

  const activate = () => (hasEvents ? onOpenDay(date) : onAdd(date));

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={`${label}${hasEvents ? ` 일정 ${eventCount}개 보기` : " 일정 추가"}`}
      onClick={activate}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          activate();
        }
      }}
      className={cn(
        "group relative cursor-pointer rounded-xl p-1 transition-[background-color,box-shadow] duration-200 hover:neu-flat",
        isToday ? "neu-flat" : hasEvents && "bg-surface/50",
        !inCurrentMonth && "opacity-40",
      )}
    >
      {hasEvents && (
        <button
          type="button"
          aria-label={`${label}에 일정 추가`}
          onClick={(e) => {
            e.stopPropagation();
            onAdd(date);
          }}
          className="neu-btn btn-spring absolute right-1 top-1 z-20 flex h-6 w-6 items-center justify-center rounded-lg text-muted opacity-0 hover:text-accent focus-visible:opacity-100 group-hover:opacity-100"
        >
          <Plus size={12} strokeWidth={2.25} />
        </button>
      )}

      <div className="flex h-8 items-center gap-2">
        <span
          className={cn(
            "flex h-6 min-w-6 items-center justify-center px-1 typo-caption-2 tabular-nums",
            isToday
              ? "btn-primary rounded-lg font-semibold"
              : getDayColor(date, holiday),
          )}
        >
          {format(date, "d")}
        </span>
        <WeatherBadge targetWeather={weather} isLoading={isWeatherLoading} />
      </div>

      <div className="relative mt-1 flex flex-col gap-0.5">
        {visible.map((cell, lane) =>
          cell ? (
            <ScheduleCard
              key={`${cell.event.id}-${date.toISOString()}`}
              event={cell.event}
              date={date}
              variant="month"
              onClick={() => onOpenEvent(cell)}
              className={cn(
                "z-10",
                !cell.isStart && "ml-[-8px] rounded-l-none border-l-0",
                !cell.isEnd && "mr-[-8px] rounded-r-none border-r-0",
              )}
            />
          ) : (
            <div key={`empty-${lane}`} aria-hidden className="h-[26px]" />
          ),
        )}

        {hidden > 0 && (
          <div className="pl-1 typo-caption-2 text-muted">
            + {hidden}개 더보기
          </div>
        )}
      </div>
    </div>
  );
}
