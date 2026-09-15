"use client";

import { useMemo } from "react";
import { addDays, endOfDay, format, isSameDay, startOfDay } from "date-fns";
import { useScheduleStore } from "@/src/hooks/stores/useScheduleStore";
import { useScheduleView } from "@/src/hooks/useScheduleView";
import { useWeathers } from "@/src/hooks/querys/useCommonApi";
import { useSchedules } from "@/src/hooks/querys/useSchedule";
import { useActiveGroup } from "@/src/hooks/querys/useGroup";
import { getWeekDates, toScheduleEvent } from "@/src/utils/schedule";
import { ScheduleEvent } from "@/src/types/schedule";
import ScheduleDial from "./ScheduleDial";
import { Row } from "../ui/layout/flex";

function eventsOnDay(events: ScheduleEvent[], date: Date) {
  const start = startOfDay(date).getTime();
  const end = endOfDay(date).getTime();
  return events
    .filter((e) => {
      const s = new Date(e.startDate).getTime();
      return s >= start && s <= end;
    })
    .sort(
      (a, b) =>
        new Date(a.startDate).getTime() - new Date(b.startDate).getTime(),
    );
}

/** "오늘 일정 2개, 14:00 회의부터 · 내일은 비어 있어요" */
function summarize(today: ScheduleEvent[], tomorrow: ScheduleEvent[]) {
  const first = today[0];
  const todayText = first
    ? `오늘 일정 ${today.length}개, ${format(new Date(first.startDate), "HH:mm")} ${first.title}부터`
    : "오늘은 비어 있어요";
  const tomorrowText = tomorrow.length
    ? `내일 ${tomorrow.length}개`
    : first
      ? "내일은 비어 있어요"
      : "내일도 비어 있어요";
  return `${todayText} · ${tomorrowText}`;
}

/** 스케줄 헤더: 왼쪽 [오늘], 가운데 다이얼, 오른쪽 일/주/월. 아래에 오늘·내일 요약 한 줄 */
export default function ScheduleHeader() {
  const { mode, currentDate, setCurrentDate } = useScheduleStore();
  const { viewType } = useScheduleView();
  const { group } = useActiveGroup();
  const { data: weathers } = useWeathers();
  const { data: schedules } = useSchedules(viewType, true, group?.groupNo);

  const today = useMemo(() => new Date(), []);
  const events = useMemo(
    () => (schedules ?? []).map(toScheduleEvent),
    [schedules],
  );
  const summary = useMemo(
    () =>
      summarize(
        eventsOnDay(events, today),
        eventsOnDay(events, addDays(today, 1)),
      ),
    [events, today],
  );

  const isTodayInView =
    mode === "day"
      ? isSameDay(currentDate, today)
      : mode === "month"
        ? currentDate.getMonth() === today.getMonth() &&
          currentDate.getFullYear() === today.getFullYear()
        : getWeekDates(currentDate).some((d) => isSameDay(d, today));

  return (
    <div className="flex shrink-0 flex-col gap-1 sm:gap-1.5">
      <Row className="relative items-center gap-2 sm:gap-3">
        <button
          type="button"
          onClick={() => setCurrentDate(new Date())}
          disabled={isTodayInView}
          className="neu-btn btn-spring typo-caption-2 items-center hidden h-9 shrink-0 rounded-xl px-3.5 font-semibold text-secondary hover:text-foreground disabled:opacity-40 sm:flex"
        >
          오늘
        </button>

        <div className="flex min-w-0 flex-1 overflow-hidden">
          <ScheduleDial weathers={weathers} />
        </div>

        {!isTodayInView && (
          <button
            type="button"
            onClick={() => setCurrentDate(new Date())}
            className="neu-btn btn-spring typo-caption-3 absolute right-0 top-1/2 z-10 flex h-8 -translate-y-1/2 items-center rounded-lg px-2.5 font-semibold text-accent sm:hidden"
          >
            오늘
          </button>
        )}
      </Row>

      <p className="hidden truncate text-center typo-caption-2 text-muted sm:block">
        {summary}
      </p>
    </div>
  );
}
