"use client";

import { format } from "date-fns";
import { useState } from "react";
import { getDayColor, getDayEvents } from "@/src/utils/schedule";
import { useScheduleStore } from "@/src/hooks/stores/useScheduleStore";
import { useScheduleViewStore } from "@/src/hooks/stores/useScheduleViewStore";
import ScheduleCard from "../components/ScheduleCard";
import { ScheduleViewProps } from "@/src/types/schedule";
import { useIsHoliday } from "@/src/hooks/useIsHoliday";
import WeatherBadge from "../components/WeatherBadge";
import HourColumn from "../layout/HourColumn";
import { HOURS } from "@/src/constant/schedule";
import { useSheetStore } from "@/src/hooks/stores/useSheetStore";
import BaseCard from "../../ui/card/BaseCard";
import { Column } from "../../ui/layout/flex";
import { useSwipe } from "@/src/hooks/useSwipe";
import NavButton from "../components/NavButton";

export default function DayView({
  events,
  holidays,
  weathers,
  isWeatherLoading,
}: ScheduleViewProps) {
  const currentDate = useScheduleStore((s) => s.currentDate);
  const next = useScheduleStore((s) => s.next);
  const prev = useScheduleStore((s) => s.prev);
  const holiday = useIsHoliday(currentDate, holidays);
  const viewType = useScheduleViewStore((s) => s.viewType);
  const { openSheet } = useSheetStore();

  const dateKey = format(currentDate, "yyyyMMdd");
  const targetWeather = weathers?.[dateKey];

  // "+N개" 배지를 누르면 그 날만 상한 없이 전부 펼쳐 보여준다. 날짜를 넘기면
  // 다시 접힌 상태로 시작한다.
  const [showAllOverlaps, setShowAllOverlaps] = useState(false);
  const [expandedDate, setExpandedDate] = useState(currentDate);

  if (currentDate !== expandedDate) {
    setExpandedDate(currentDate);
    setShowAllOverlaps(false);
  }

  const getDayLayouts = getDayEvents(
    events,
    currentDate,
    showAllOverlaps ? Infinity : undefined,
  );

  const swipeHandlers = useSwipe(next, prev);

  return (
    <div className="h-full neu-flat rounded-3xl flex flex-col overflow-hidden">
      <BaseCard
        className="shrink-0 px-3 py-1"
        glow
        childClass="flex items-center justify-between sm:justify-center"
      >
        <NavButton
          direction="prev"
          onClick={prev}
          label="이전 날"
          className="shrink-0 sm:hidden"
        />

        <Column className="items-center">
          <span
            className={`typo-body-2 font-semibold ${getDayColor(currentDate, holiday)}`}
          >
            {format(currentDate, "M월, d일 EEEE")}
          </span>
          <WeatherBadge
            targetWeather={targetWeather}
            isLoading={isWeatherLoading}
          />
        </Column>

        <NavButton
          direction="next"
          onClick={next}
          label="다음 날"
          className="shrink-0 sm:hidden"
        />
      </BaseCard>

      <div className="flex-1 overflow-y-auto min-h-0 p-2" {...swipeHandlers}>
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
                    type: viewType,
                  })
                }
                className="h-11 sm:h-14 border-b border-divider/40 box-border hover:bg-surface/40 transition-colors cursor-pointer"
              />
            ))}
            {getDayLayouts.map((layout) => (
              <ScheduleCard
                key={`${layout.event.id}-${layout.date.getTime()}-${layout.isOverflow ? "overflow" : ""}`}
                event={layout.event}
                date={layout.date}
                top={layout.top}
                height={layout.height}
                width={layout.width}
                left={layout.left}
                isOverflow={layout.isOverflow}
                overflowCount={layout.overflowCount}
                variant="day"
                onClick={
                  layout.isOverflow
                    ? () => setShowAllOverlaps(true)
                    : () => openSheet({ event: layout.event })
                }
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
