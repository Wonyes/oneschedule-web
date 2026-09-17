"use client";

import { useScheduleStore } from "@/src/hooks/stores/useScheduleStore";
import { ScheduleViewProps } from "@/src/types/schedule";
import { getMonthDates } from "@/src/utils/schedule";
import MonthGrid from "./MonthGrid";
import MonthMobile from "./MonthMobile";

/** 월뷰. 데스크톱은 그리드, 모바일은 스트립 + 목록 (CSS로 전환) */
export default function MonthView(props: ScheduleViewProps) {
  const currentDate = useScheduleStore((s) => s.currentDate);
  const monthDates = getMonthDates(currentDate);

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <MonthGrid monthDates={monthDates} {...props} />
      <MonthMobile monthDates={monthDates} {...props} />
    </div>
  );
}
