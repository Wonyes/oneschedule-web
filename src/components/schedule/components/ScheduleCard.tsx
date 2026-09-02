import { AlertTriangle } from "lucide-react";
import { ScheduleEvent } from "@/src/types/schedule";
import { getTimes, isSameDate } from "@/src/utils/schedule";
import { EVENT_STYLES } from "@/src/constant/schedule";
import { Column, Row } from "../../ui/layout/flex";

const ConflictBadge = () => (
  <AlertTriangle
    className="shrink-0 text-error-500"
    size={11}
    strokeWidth={2.5}
    aria-label="다른 일정과 시간이 겹칩니다"
  />
);

type EventCardProps = {
  event: ScheduleEvent;
  variant?: "week" | "month" | "day" | "agenda";
  top?: number;
  width?: number;
  left?: number;
  height?: number;
  date?: Date;
  className?: string;
  onClick?: () => void;
};

export default function ScheduleCard({
  top,
  date,
  left,
  width,
  event,
  height,
  className = "",
  variant = "week",
  onClick,
}: EventCardProps) {
  // category에 "default"가 올 수 있는데 EVENT_STYLES에는 항목이 없다.
  const style = EVENT_STYLES[event.category as keyof typeof EVENT_STYLES] as
    | (typeof EVENT_STYLES)[keyof typeof EVENT_STYLES]
    | undefined;

  const start = new Date(event.startDate);
  const end = new Date(event.endDate);

  const isStart = isSameDate(start, date);
  const isEnd = isSameDate(end, date);

  const horizontalConnection = `
    ${!isStart ? "-ml-[1px] rounded-l-none border-l-0" : "rounded-l-lg"}
    ${!isEnd ? "-mr-[1px] rounded-r-none border-r-0" : "rounded-r-lg"}
  `;

  const connectionClass = variant === "week" && horizontalConnection;
  const conflictRing = event.hasConflict ? "ring-1 ring-error-500/70" : "";

  if (variant === "month") {
    return (
      <div
        onClick={(e) => {
          e.stopPropagation();
          onClick?.();
        }}
        className={`
          group px-2 py-1 rounded-md truncate flex items-center gap-1.5
          bg-surface/80  border border-white/5
          hover:border-white/15 hover:bg-surface-hover
          cursor-pointer transition-all duration-150 ${connectionClass} ${conflictRing} ${className}
        `}
      >
        <span
          className={`w-1.5 h-1.5 rounded-full shrink-0 ${style?.dot ?? "bg-accent"}`}
        />
        <span className="typo-caption-2 truncate font-medium text-secondary group-hover:text-foreground">
          {event.title}
        </span>
        {event.hasConflict && <ConflictBadge />}
      </div>
    );
  }

  if (variant === "agenda") {
    return (
      <div
        onClick={onClick}
        className={`
          flex items-center gap-3 rounded-xl
          bg-surface/90 border border-white/10
          p-3 transition-all duration-150
          cursor-pointer hover:border-accent/40 hover:bg-surface-hover ${conflictRing} ${className}
        `}
      >
        <span
          className={`h-2 w-2 shrink-0 rounded-full ${style?.dot ?? "bg-accent"}`}
        />
        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          <Row className="min-w-0 items-center gap-1">
            <span className="typo-caption-1 font-semibold text-foreground truncate">
              {event.title}
            </span>
            {event.hasConflict && <ConflictBadge />}
          </Row>
          <span className="text-[11px] font-medium text-accent/80 tracking-tight">
            {getTimes(event.startDate)} - {getTimes(event.endDate)}
          </span>
        </div>
      </div>
    );
  }

  if (variant === "day") {
    return (
      <div
        onClick={onClick}
        className={`
          absolute left-0 right-0 rounded-lg
          bg-surface/90  border border-white/10
          px-2 py-1.5 shadow-xl z-10 overflow-hidden transition-all duration-200
          cursor-pointer hover:border-accent/40 hover:bg-surface-hover ${conflictRing} ${className}
        `}
        style={{
          top: `${top}%`,
          height: `${height}%`,
          minHeight: 28,
          width: `${width}%`,
          left: `${left}%`,
        }}
      >
        {(isStart || isEnd) && (
          <Column className="h-full min-w-0 justify-center gap-0.5">
            <Row className="min-w-0 items-center gap-1.5">
              <span
                className={`h-1.5 w-1.5 shrink-0 rounded-full ${style?.dot ?? "bg-accent"}`}
              />
              <span className="typo-caption-1 truncate font-semibold text-foreground">
                {event.title}
              </span>
              {event.hasConflict && <ConflictBadge />}
            </Row>
            <span className="shrink-0 whitespace-nowrap pl-3 text-[10px] font-medium text-accent/80 tracking-tight">
              {getTimes(event.startDate)}-{getTimes(event.endDate)}
            </span>
          </Column>
        )}
      </div>
    );
  }

  return (
    <div
      onClick={onClick}
      className={`
        absolute left-0 right-0 rounded-lg
        bg-surface/90 border border-white/10
        px-2 py-1.5 z-10 overflow-hidden
        cursor-pointer hover:z-50 hover:border-accent/50 hover:bg-surface-hover hover:shadow-2xl
        transition-all duration-200
        ${connectionClass} ${conflictRing} ${className}
      `}
      style={{
        top: `${top}%`,
        height: `${height}%`,
        minHeight: 28,
      }}
    >
      <div
        className={`absolute left-0 top-0 bottom-0 w-1 ${style?.dot ?? "bg-accent"}`}
      />

      {(isStart || isEnd) && (
        <Row className="h-full min-w-0 items-center gap-1.5 pl-1.5">
          <span className="typo-caption-1 truncate font-semibold text-foreground">
            {event.title}
          </span>
          {event.hasConflict && <ConflictBadge />}
          <span className="shrink-0 whitespace-nowrap text-[10px] font-medium text-accent/80 tracking-tight">
            {getTimes(event.startDate)}-{getTimes(event.endDate)}
          </span>
        </Row>
      )}
    </div>
  );
}
