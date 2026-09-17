import { ScheduleEvent } from "@/src/types/schedule";
import { cn } from "@/src/utils/cn";
import AgendaCard from "./AgendaCard";
import { CardPosition, positionStyle } from "./cardShared";
import MonthCard from "./MonthCard";
import TimedCard from "./TimedCard";

type Props = CardPosition & {
  event: ScheduleEvent;
  variant?: "week" | "month" | "day" | "agenda";
  date?: Date;
  className?: string;
  onClick?: () => void;
  /** week·day에서 겹친 일정을 "+N"으로 접은 자리 */
  isOverflow?: boolean;
  overflowCount?: number;
};

/** 뷰별 일정 카드 진입점. 모양은 variant 파일에서 */
export default function ScheduleCard({
  variant = "week",
  isOverflow = false,
  overflowCount = 0,
  event,
  date,
  className,
  onClick,
  ...position
}: Props) {
  if (isOverflow && (variant === "week" || variant === "day")) {
    return (
      <button
        type="button"
        onClick={onClick}
        aria-label={`숨겨진 일정 ${overflowCount}개 보기`}
        style={positionStyle(position)}
        className={cn(
          "absolute z-10 flex items-center justify-center rounded-lg border border-divider bg-surface-hover typo-caption-2 font-medium text-muted transition-colors hover:z-50 hover:bg-surface hover:text-foreground",
          className,
        )}
      >
        +{overflowCount}
      </button>
    );
  }

  if (variant === "month")
    return <MonthCard event={event} className={className} onClick={onClick} />;
  if (variant === "agenda")
    return <AgendaCard event={event} className={className} onClick={onClick} />;

  return (
    <TimedCard
      event={event}
      variant={variant}
      date={date}
      className={className}
      onClick={onClick}
      {...position}
    />
  );
}
