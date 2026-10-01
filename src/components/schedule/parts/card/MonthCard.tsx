import { ScheduleEvent } from "@/src/types/schedule";
import { cn } from "@/src/utils/cn";
import { conflictClass, dotClass } from "./cardShared";

/** 월뷰 칸 안 한 줄 카드. 여러 날 걸치면 호출부가 좌우 모서리를 잘라 잇는다 */
export default function MonthCard({
  event,
  className,
  onClick,
}: {
  event: ScheduleEvent;
  className?: string;
  onClick?: () => void;
}) {
  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        onClick?.();
      }}
      className={cn(
        "group flex cursor-pointer items-center gap-1.5 truncate rounded-md border border-divider/60 bg-surface/80 px-2 py-1 transition-all duration-150 hover:border-divider hover:bg-surface-hover",
        conflictClass(event),
        className,
      )}
    >
      <span
        className={cn("h-1.5 w-1.5 shrink-0 rounded-full", dotClass(event))}
      />
      <span className="min-w-0 flex-1 truncate typo-caption-2 font-medium text-secondary group-hover:text-foreground">
        {event.title}
      </span>
    </div>
  );
}
