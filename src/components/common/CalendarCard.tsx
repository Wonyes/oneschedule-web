import { Labels } from "../common/Labels";
import { EVENT_STYLES } from "@//constant/calendar";
import { CalendarEvent } from "@//types/calendar";
import { getTimes, isSameDate } from "@//utils/calendar";

type EventCardProps = {
  event: CalendarEvent;
  variant?: "week" | "month" | "day";
  top?: number;
  height?: number;
  date?: Date;
  className?: string;
  alwaysShow?: boolean;
};

export default function CalendarCard({
  event,
  top,
  date,
  height,
  className = "",
  variant = "week",
}: EventCardProps) {
  const style = EVENT_STYLES[event.category];

  const start = new Date(event.startDate);
  const end = new Date(event.endDate);

  const isStart = isSameDate(start, date);
  const isEnd = isSameDate(end, date);

  const horizontalConnection = `
  ${!isStart ? "-ml-[1px] rounded-l-none border-l-0" : "rounded-l-[8px]"}
  ${!isEnd ? "-mr-[1px] rounded-r-none border-r-0" : "rounded-r-[8px]"}
`;

  const connectionClass = variant === "week" && horizontalConnection;

  if (variant === "month") {
    return (
      <div
        className={`p-1 rounded truncate flex flex-col h-12 items-left gap-1 border ${style.bg} ${style.border} ${connectionClass} ${className}`}
      >
        {isStart && (
          <Labels
            text={`${getTimes(event.startDate)} - ${getTimes(event.endDate)}`}
            className={style.label}
          />
        )}
        <span className="typo-caption-1 truncate">{event.title}</span>
      </div>
    );
  }

  if (variant === "day") {
    return (
      <div
        className={`
        absolute left-0 right-0 scale-[0.92]
        border ${style.bg} ${style.border}
        p-2 shadow-sm z-10 ${className}
      `}
        style={{ top: `${top}px`, height: `${height}px` }}
      >
        <Labels
          text={`${getTimes(event.startDate)} - ${getTimes(event.endDate)}`}
          className={style.label}
        />
        <span className="typo-caption-1 mt-1">{event.title}</span>
      </div>
    );
  }

  return (
    <div
      className={`
        absolute left-0 right-0 scale-[0.92]
        border ${style.bg} ${style.border} 
        p-2 shadow-sm z-10
        ${connectionClass} ${className}
      `}
      style={{ top: `${top}px`, height: `${height}px` }}
    >
      {isStart && (
        <>
          <Labels
            text={`${getTimes(event.startDate)} - ${getTimes(event.endDate)}`}
            className={style.label}
          />
          <span className="typo-caption-1 mt-1">{event.title}</span>
        </>
      )}

      {isEnd && isStart !== isEnd && (
        <>
          <Labels
            text={`${getTimes(event.startDate)} - ${getTimes(event.endDate)}`}
            className={style.label}
          />
          <span className="typo-caption-1 mt-1">{event.title}</span>
        </>
      )}
    </div>
  );
}
