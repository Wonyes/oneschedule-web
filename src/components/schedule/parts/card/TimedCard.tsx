import { Column, Row } from "@/src/components/ui/layout/flex";
import { ScheduleEvent } from "@/src/types/schedule";
import { cn } from "@/src/utils/cn";
import { isSameDate } from "@/src/utils/schedule";
import { getTimes } from "@/src/utils/time";
import {
  CardPosition,
  conflictClass,
  dotClass,
  isCompact,
  positionStyle,
} from "./cardShared";

/**
 * 시간 격자 위 카드 (week · day).
 * week는 왼쪽 색 띠 + 여러 날 걸치면 좌우 모서리를 잘라 잇고, day는 점 + 시간을 보여준다.
 * 제목은 시작일이나 종료일 칸에만 그린다 (중간 날은 띠만).
 */
export default function TimedCard({
  event,
  variant,
  date,
  className,
  onClick,
  ...position
}: CardPosition & {
  event: ScheduleEvent;
  variant: "week" | "day";
  date?: Date;
  className?: string;
  onClick?: () => void;
}) {
  const isStart = isSameDate(new Date(event.startDate), date);
  const isEnd = isSameDate(new Date(event.endDate), date);
  const compact = isCompact(event);
  const time = `${getTimes(event.startDate)}-${getTimes(event.endDate)}`;

  const connection =
    variant === "week" &&
    cn(
      isStart ? "rounded-l-lg" : "-ml-[1px] rounded-l-none border-l-0",
      isEnd ? "rounded-r-lg" : "-mr-[1px] rounded-r-none border-r-0",
    );

  return (
    <div
      onClick={onClick}
      style={positionStyle(position)}
      className={cn(
        "absolute z-10 cursor-pointer overflow-hidden rounded-lg border border-divider bg-surface/90 px-2 transition-all duration-200 hover:bg-surface-hover",
        compact ? "py-1" : "py-1.5",
        variant === "week"
          ? "hover:z-50 hover:border-accent/50 hover:shadow-2xl"
          : "shadow-xl hover:border-accent/40",
        connection,
        conflictClass(event),
        className,
      )}
    >
      {variant === "week" && (
        <div
          className={cn("absolute bottom-0 left-0 top-0 w-1", dotClass(event))}
        />
      )}

      {(isStart || isEnd) &&
        (variant === "week" ? (
          <Column className="h-full min-w-0 justify-center gap-0.5 pl-1.5">
            <span className="w-full truncate typo-caption-1 font-semibold text-foreground">
              {event.title}
            </span>
            {!compact && (
              <span className="shrink-0 whitespace-nowrap text-[10px] font-medium tracking-tight text-accent/80">
                {time}
              </span>
            )}
          </Column>
        ) : compact ? (
          <Row className="h-full min-w-0 items-center gap-1.5">
            <span
              className={cn(
                "h-1.5 w-1.5 shrink-0 rounded-full",
                dotClass(event),
              )}
            />
            <span className="min-w-0 flex-1 truncate typo-caption-1 font-semibold text-foreground">
              {event.title}
            </span>
            <span className="shrink-0 whitespace-nowrap text-[10px] font-medium tracking-tight text-accent/80">
              {time}
            </span>
          </Row>
        ) : (
          <Column className="h-full min-w-0 justify-center gap-0.5">
            <Row className="min-w-0 items-center gap-1.5">
              <span
                className={cn(
                  "h-1.5 w-1.5 shrink-0 rounded-full",
                  dotClass(event),
                )}
              />
              <span className="min-w-0 flex-1 truncate typo-caption-1 font-semibold text-foreground">
                {event.title}
              </span>
            </Row>
            <span className="shrink-0 whitespace-nowrap pl-3 text-[10px] font-medium tracking-tight text-accent/80">
              {time}
            </span>
          </Column>
        ))}
    </div>
  );
}
