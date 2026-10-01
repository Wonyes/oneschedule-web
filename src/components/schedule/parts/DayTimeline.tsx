"use client";

import { format, isToday, isTomorrow } from "date-fns";
import { ko } from "date-fns/locale";

import { Column, Row } from "@/src/components/ui/layout/flex";
import { EVENT_STYLES } from "@/src/constant/schedule";
import { ScheduleEvent } from "@/src/types/schedule";
import { cn } from "@/src/utils/cn";
import { getTimes } from "@/src/utils/time";

/** 날짜 타일 + 그 날의 일정 목록. 그룹 페이지와 스케줄 페이지가 같은 모양을 쓴다. */
export function DayGroup({
  date,
  events,
  trailing,
  emptyText = "비어 있어요.",
  onEventClick,
}: {
  date: Date;
  events: ScheduleEvent[];
  /** 날짜 라벨 오른쪽에 붙는 부가 정보(날씨 등) */
  trailing?: React.ReactNode;
  emptyText?: string;
  onEventClick?: (event: ScheduleEvent) => void;
}) {
  const today = isToday(date);
  const label = today
    ? "오늘"
    : isTomorrow(date)
      ? "내일"
      : format(date, "EEEE", { locale: ko });

  return (
    <Row className="w-full items-start gap-3">
      <DayTile date={date} />

      <Column className="min-w-0 flex-1 gap-0.5">
        <Row className="h-5 items-baseline gap-1.5 px-1">
          <span
            className={cn(
              "typo-caption-2 font-semibold",
              today ? "text-accent" : "text-foreground",
            )}
          >
            {label}
          </span>
          <span className="typo-caption-3 text-place-h">
            {format(date, "M월 d일", { locale: ko })}
          </span>
          {trailing && <span className="ml-auto self-center">{trailing}</span>}
        </Row>

        {events.length === 0 ? (
          <span className="px-1 py-1.5 typo-caption-3 text-place-h">
            {emptyText}
          </span>
        ) : (
          events.map((event) => (
            <ScheduleItem
              key={event.id}
              event={event}
              onClick={onEventClick ? () => onEventClick(event) : undefined}
            />
          ))
        )}
      </Column>
    </Row>
  );
}

export function DayTile({ date }: { date: Date }) {
  const today = isToday(date);

  return (
    <Column
      className={cn(
        "h-12 w-12 shrink-0 items-center justify-center gap-0 rounded-xl",
        today ? "btn-primary" : "neu-flat text-foreground",
      )}
    >
      <span className="typo-sub-t-2 leading-none tabular-nums">
        {format(date, "d")}
      </span>
      <span
        className={cn(
          "mt-0.5 typo-caption-3",
          today ? "text-on-primary/80" : "text-place-h",
        )}
      >
        {format(date, "EEE", { locale: ko })}
      </span>
    </Column>
  );
}

function ScheduleItem({
  event,
  onClick,
}: {
  event: ScheduleEvent;
  onClick?: () => void;
}) {
  const style = EVENT_STYLES[event.category as keyof typeof EVENT_STYLES];
  const Tag = onClick ? "button" : "div";

  return (
    <Tag
      type={onClick ? "button" : undefined}
      onClick={onClick}
      className={cn(
        "flex w-full min-w-0 items-center gap-2.5 border-b border-dashed border-divider px-1 py-2 text-left last:border-none",
        onClick && "btn-spring rounded-lg hover:bg-surface-hover",
      )}
    >
      <span
        className={cn(
          "h-2 w-2 shrink-0 rounded-full",
          style?.dot ?? "bg-accent",
        )}
      />
      <span className="w-[86px] shrink-0 typo-caption-3 tabular-nums text-muted">
        {getTimes(event.startDate, event.endDate)}
      </span>
      <span className="min-w-0 flex-1 truncate typo-caption-2 font-medium text-foreground">
        {event.title}
      </span>
      {event.author?.nickname && (
        <span className="max-w-[72px] shrink-0 truncate typo-caption-3 text-place-h">
          {event.author.nickname}
        </span>
      )}
    </Tag>
  );
}
