"use client";

import { useMemo } from "react";
import { format, isSameMonth } from "date-fns";

import { useScheduleStore } from "@/src/hooks/stores/useScheduleStore";
import { useSheetStore } from "@/src/hooks/stores/useSheetStore";
import { useScheduleView } from "@/src/hooks/useScheduleView";
import { ScheduleViewProps } from "@/src/types/schedule";
import { getMonthWeekLanes, MonthLaneCell } from "@/src/utils/schedule";
import MonthDayCell from "./MonthDayCell";
import WeekdayRow from "./WeekdayRow";

/** 데스크톱(sm↑) 월 그리드 */
export default function MonthGrid({
  monthDates,
  events,
  holidays,
  weathers,
  isWeatherLoading,
}: ScheduleViewProps & { monthDates: Date[] }) {
  const currentDate = useScheduleStore((s) => s.currentDate);
  const setMode = useScheduleStore((s) => s.setMode);
  const setCurrentDate = useScheduleStore((s) => s.setCurrentDate);
  const { viewType } = useScheduleView();
  const { openSheet } = useSheetStore();

  // 주 단위로 줄을 배정해서 여러 날짜에 걸친 일정이 같은 줄에 이어지게 한다.
  const lanesByDate = useMemo(() => {
    const byDate = new Map<number, (MonthLaneCell | null)[]>();
    for (let i = 0; i < monthDates.length; i += 7) {
      const week = monthDates.slice(i, i + 7);
      getMonthWeekLanes(events, week).forEach((lanes, j) =>
        byDate.set(week[j].getTime(), lanes),
      );
    }
    return byDate;
  }, [events, monthDates]);

  const openDay = (date: Date) => {
    setCurrentDate(date);
    setMode("day");
  };

  return (
    <div className="hidden min-h-0 flex-1 flex-col sm:flex sm:overflow-x-auto">
      <div className="flex min-h-0 min-w-[560px] flex-1 flex-col">
        <WeekdayRow />

        <div className="min-h-0 flex-1 overflow-y-auto p-2">
          <div
            className="neu-pressed grid min-h-full grid-cols-7 gap-1.5 rounded-2xl p-1.5"
            style={{
              gridTemplateRows: `repeat(${monthDates.length / 7}, minmax(0, 1fr))`,
            }}
          >
            {monthDates.map((date) => (
              <MonthDayCell
                key={date.toISOString()}
                date={date}
                lanes={lanesByDate.get(date.getTime()) ?? []}
                inCurrentMonth={isSameMonth(date, currentDate)}
                holidays={holidays}
                weather={weathers?.[format(date, "yyyyMMdd")]}
                isWeatherLoading={isWeatherLoading}
                onOpenDay={openDay}
                onAdd={(d) => openSheet({ date: d, type: viewType })}
                onOpenEvent={(cell) => openSheet({ event: cell.event })}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
