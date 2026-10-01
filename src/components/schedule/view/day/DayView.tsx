"use client";

import { useEffect, useRef, useState } from "react";
import { getDayEvents, splitMultiDay } from "@/src/utils/schedule";
import AllDayRow from "../../parts/AllDayRow";
import { useScheduleStore } from "@/src/hooks/stores/useScheduleStore";
import { useScheduleView } from "@/src/hooks/useScheduleView";
import ScheduleCard from "../../parts/card/ScheduleCard";
import { ScheduleViewProps } from "@/src/types/schedule";
import HourColumn from "../../parts/HourColumn";
import { HOURS } from "@/src/constant/schedule";
import { useSheetStore } from "@/src/hooks/stores/useSheetStore";
import { useSwipe } from "@/src/hooks/useSwipe";

export default function DayView({ events }: ScheduleViewProps) {
  const currentDate = useScheduleStore((s) => s.currentDate);
  const next = useScheduleStore((s) => s.next);
  const prev = useScheduleStore((s) => s.prev);
  const { viewType } = useScheduleView();
  const { openSheet } = useSheetStore();

  const [showAllOverlaps, setShowAllOverlaps] = useState(false);
  const [expandedDate, setExpandedDate] = useState(currentDate);

  if (currentDate !== expandedDate) {
    setExpandedDate(currentDate);
    setShowAllOverlaps(false);
  }

  const { timed, multiDay } = splitMultiDay(events);
  const getDayLayouts = getDayEvents(
    timed,
    currentDate,
    showAllOverlaps ? Infinity : undefined,
  );

  const swipeHandlers = useSwipe(next, prev);
  const scrollRef = useRef<HTMLDivElement>(null);

  // 날짜가 바뀌면 첫 일정 한 시간 전(없으면 오전 8시)이 보이도록 스크롤한다.
  const firstHour = getDayLayouts.length
    ? Math.min(
        ...getDayLayouts.map((l) => new Date(l.event.startDate).getHours()),
      )
    : 9;

  useEffect(() => {
    const root = scrollRef.current;
    const row = root?.querySelector<HTMLElement>(
      `[data-hour="${Math.max(firstHour - 1, 0)}"]`,
    );
    if (!root || !row) return;

    root.scrollTop =
      row.getBoundingClientRect().top -
      root.getBoundingClientRect().top +
      root.scrollTop;
  }, [currentDate, firstHour]);

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <AllDayRow
        dates={[currentDate]}
        events={multiDay}
        gutter="60px"
        onClick={(event) => openSheet({ event })}
      />

      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto min-h-0 p-2"
        {...swipeHandlers}
      >
        <div className="grid grid-cols-[60px_1fr] min-h-full neu-pressed rounded-2xl">
          <HourColumn />

          <div className="relative">
            {HOURS.map((hour, i) => (
              <div
                key={i}
                data-hour={i}
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
