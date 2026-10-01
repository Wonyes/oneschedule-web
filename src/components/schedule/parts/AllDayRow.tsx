"use client";

import { ScheduleEvent } from "@/src/types/schedule";
import { cn } from "@/src/utils/cn";
import { getMonthWeekLanes } from "@/src/utils/schedule";
import ScheduleCard from "./card/ScheduleCard";

/**
 * 시간 격자 위 "종일" 줄. 여러 날에 걸친 일정을 날짜 칸을 가로지르는 막대로 그린다.
 * dates가 7개면 주뷰, 3개면 모바일 주뷰, 1개면 일뷰. 일정이 없으면 아무것도 안 그린다.
 */
export default function AllDayRow({
  dates,
  events,
  gutter,
  onClick,
}: {
  dates: Date[];
  events: ScheduleEvent[];
  /** 왼쪽 시간 열 너비와 맞춘다 (예: "60px") */
  gutter: string;
  onClick: (event: ScheduleEvent) => void;
}) {
  if (events.length === 0) return null;

  const lanes = getMonthWeekLanes(events, dates);
  const laneCount = Math.max(...lanes.map((l) => l.length));
  if (laneCount === 0) return null;

  return (
    <div
      className="grid shrink-0 border-b border-divider bg-surface/40 px-2 pb-1.5 pt-1"
      style={{
        gridTemplateColumns: `${gutter} repeat(${dates.length}, minmax(0, 1fr))`,
      }}
    >
      <div className="flex items-start justify-center pt-1 typo-caption-3 text-place-h">
        종일
      </div>

      {dates.map((date, i) => (
        <div
          key={date.toISOString()}
          className="flex min-w-0 flex-col gap-0.5 border-r border-divider/40 px-0.5 last:border-r-0"
        >
          {Array.from({ length: laneCount }, (_, lane) => {
            const cell = lanes[i][lane];
            return cell ? (
              <ScheduleCard
                key={`${cell.event.id}-${lane}`}
                event={cell.event}
                date={date}
                variant="month"
                onClick={() => onClick(cell.event)}
                className={cn(
                  "z-10",
                  !cell.isStart && "ml-[-6px] rounded-l-none border-l-0",
                  !cell.isEnd && "mr-[-6px] rounded-r-none border-r-0",
                )}
              />
            ) : (
              <div key={`empty-${lane}`} aria-hidden className="h-[26px]" />
            );
          })}
        </div>
      ))}
    </div>
  );
}
