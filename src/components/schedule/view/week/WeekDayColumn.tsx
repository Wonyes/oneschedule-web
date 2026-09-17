import { isSameDay } from "date-fns";

import { ScheduleEvent } from "@/src/types/schedule";
import { getWeekEvents } from "@/src/utils/schedule";
import ScheduleCard from "../../parts/card/ScheduleCard";
import TimeGrid from "../../parts/TimeGrid";

export type WeekLayouts = ReturnType<typeof getWeekEvents>;

/** 데스크톱·모바일 주뷰가 공유하는 클릭 핸들러 */
export type WeekHandlers = {
  onClickTime: (date: Date, startTime: string) => void;
  onClickEvent: (event: ScheduleEvent) => void;
  /** "+N개"를 누르면 그 날의 일뷰로 */
  onClickOverflow: (date: Date) => void;
};

/** 하루 세로 열: 시간 격자 위에 그 날 일정 카드 */
export default function WeekDayColumn({
  date,
  layouts,
  onClickTime,
  onClickEvent,
  onClickOverflow,
}: WeekHandlers & { date: Date; layouts: WeekLayouts }) {
  const dayLayouts = layouts.filter((layout) => isSameDay(layout.date, date));

  return (
    <div className="relative border-r border-divider/40 last:border-r-0">
      <TimeGrid onClickTime={(startTime) => onClickTime(date, startTime)} />

      {dayLayouts.map((layout) => (
        <ScheduleCard
          key={`${layout.event.id}-${layout.date.toISOString()}-${layout.isOverflow ? "overflow" : ""}`}
          event={layout.event}
          top={layout.top}
          height={layout.height}
          date={layout.date}
          width={layout.width}
          left={layout.left}
          isOverflow={layout.isOverflow}
          overflowCount={layout.overflowCount}
          variant="week"
          onClick={() =>
            layout.isOverflow
              ? onClickOverflow(date)
              : onClickEvent(layout.event)
          }
        />
      ))}
    </div>
  );
}
