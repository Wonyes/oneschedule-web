import { ScheduleEvent } from "@/src/types/schedule";
import { getTimes, isSameDate } from "@/src/utils/Schedule";
import { Label } from "../../ui/Labels";
import { EVENT_STYLES } from "@/src/constant/schedule";

type EventCardProps = {
  event: ScheduleEvent;
  variant?: "week" | "month" | "day";
  top?: number;
  width?: number;
  left?: number;
  height?: number;
  date?: Date;
  className?: string;
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
          <Label className={`${style.label}`}>
            {getTimes(event.startDate)} - {getTimes(event.endDate)}
          </Label>
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
        style={{
          top: `${top}px`,
          height: `${height}px`,
          width: `${width}%`,
          left: `${left}%`,
        }}
      >
        <Label className={style.label}>
          <span>
            {getTimes(event.startDate)} - {getTimes(event.endDate)}
          </span>
        </Label>
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
        hover:z-50 hover:scale-100 hover:opacity-100 opacity-90
        transition-all duration-200
        ${connectionClass} ${className}
      `}
      style={{
        top: `${top}px`,
        height: `${height}px`,
      }}
    >
      {isStart && (
        <>
          <Label className={style.label}>
            <span>
              {getTimes(event.startDate)} - {getTimes(event.endDate)}
            </span>
          </Label>
          <span className="typo-caption-1 mt-1">{event.title}</span>
        </>
      )}

      {isEnd && isStart !== isEnd && (
        <>
          <Label className={style.label}>
            <span>
              {getTimes(event.startDate)} - {getTimes(event.endDate)}
            </span>
          </Label>
          <span className="typo-caption-1 mt-1">{event.title}</span>
        </>
      )}
    </div>
  );
}
