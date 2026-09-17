import { format, isSameDay } from "date-fns";
import { ko } from "date-fns/locale";

import WeatherBadge from "@/src/components/common/weather/WeatherBadge";
import { ScheduleViewProps } from "@/src/types/schedule";
import { findHoliday, getDayColor } from "@/src/utils/schedule";
import { cn } from "@/src/utils/cn";

/** 주뷰 열 머리: 요일 + 날씨 + 날짜(오늘은 채움) */
export default function WeekDayHeader({
  date,
  holidays,
  weathers,
  isWeatherLoading,
  mobile = false,
}: Pick<ScheduleViewProps, "holidays" | "weathers" | "isWeatherLoading"> & {
  date: Date;
  mobile?: boolean;
}) {
  const color = getDayColor(date, findHoliday(date, holidays));
  const isToday = isSameDay(date, new Date());

  return (
    <div className="flex h-full flex-col items-center justify-center gap-1">
      <div
        className={cn(
          "flex items-center gap-1.5",
          mobile ? "text-sm" : "text-xs",
          color,
        )}
      >
        <span>{format(date, "EEE", { locale: ko })}</span>
        <WeatherBadge
          targetWeather={weathers?.[format(date, "yyyyMMdd")]}
          isLoading={isWeatherLoading}
        />
      </div>

      <span
        className={cn(
          "flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold",
          isToday ? "bg-primary text-on-primary" : color,
        )}
      >
        {format(date, "d")}
      </span>
    </div>
  );
}
