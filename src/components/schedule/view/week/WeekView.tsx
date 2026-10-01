"use client";

import { useMemo } from "react";
import { addDays, isSameDay } from "date-fns";

import { useScheduleStore } from "@/src/hooks/stores/useScheduleStore";
import { useSheetStore } from "@/src/hooks/stores/useSheetStore";
import { useScheduleView } from "@/src/hooks/useScheduleView";
import { ScheduleViewProps } from "@/src/types/schedule";
import {
  getWeekDates,
  getWeekEvents,
  splitMultiDay,
} from "@/src/utils/schedule";
import { useScrollToFirstHour } from "./useScrollToFirstHour";
import { WeekHandlers } from "./WeekDayColumn";
import WeekDesktop from "./WeekDesktop";
import WeekMobile from "./WeekMobile";

/** 주뷰. 데스크톱은 7일, 모바일은 현재 날짜 주변 3일 (CSS로 전환) */
export default function WeekView({ events, ...rest }: ScheduleViewProps) {
  const currentDate = useScheduleStore((s) => s.currentDate);
  const setCurrentDate = useScheduleStore((s) => s.setCurrentDate);
  const setMode = useScheduleStore((s) => s.setMode);
  const { viewType } = useScheduleView();
  const { openSheet } = useSheetStore();

  const weekDates = useMemo(() => getWeekDates(currentDate), [currentDate]);

  // 모바일: 현재 날짜를 가운데 두고 3일, 주 양끝에선 끝에 붙인다
  const mobileDates = useMemo(() => {
    const i = weekDates.findIndex((d) => isSameDay(d, currentDate));
    if (i <= 0) return weekDates.slice(0, 3);
    if (i >= weekDates.length - 2) return weekDates.slice(-3);
    return weekDates.slice(i - 1, i + 2);
  }, [weekDates, currentDate]);

  // 여러 날 걸친 일정은 종일 줄로, 나머지만 시간 격자에
  const { timed, multiDay } = useMemo(() => splitMultiDay(events), [events]);
  const layouts = useMemo(
    () => getWeekEvents(timed, weekDates),
    [timed, weekDates],
  );
  const scrollRef = useScrollToFirstHour(layouts, weekDates[0].getTime());

  const handlers: WeekHandlers = {
    onClickTime: (date, startTime) =>
      openSheet({ date, startTime, type: viewType }),
    onClickEvent: (event) => openSheet({ event }),
    onClickOverflow: (date) => {
      setCurrentDate(date);
      setMode("day");
    },
  };

  return (
    <div className="h-full overflow-hidden">
      <WeekDesktop
        dates={weekDates}
        layouts={layouts}
        allDay={multiDay}
        scrollRef={scrollRef(0)}
        {...rest}
        {...handlers}
      />
      <WeekMobile
        dates={mobileDates}
        layouts={layouts}
        allDay={multiDay}
        scrollRef={scrollRef(1)}
        onPrev={() => setCurrentDate(addDays(currentDate, -3))}
        onNext={() => setCurrentDate(addDays(currentDate, 3))}
        {...rest}
        {...handlers}
      />
    </div>
  );
}
