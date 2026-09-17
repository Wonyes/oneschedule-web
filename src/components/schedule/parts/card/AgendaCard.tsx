import { ScheduleEvent } from "@/src/types/schedule";
import { cn } from "@/src/utils/cn";
import { getTimes } from "@/src/utils/time";
import { conflictClass, dotClass } from "./cardShared";

/** 목록형 카드 (모바일 월뷰 선택일 아래) */
export default function AgendaCard({
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
      onClick={onClick}
      className={cn(
        "flex cursor-pointer items-center gap-3 rounded-xl border border-divider bg-surface/90 p-3 transition-all duration-150 hover:border-accent/40 hover:bg-surface-hover",
        conflictClass(event),
        className,
      )}
    >
      <span className={cn("h-2 w-2 shrink-0 rounded-full", dotClass(event))} />
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="truncate typo-caption-1 font-semibold text-foreground">
          {event.title}
        </span>
        <span className="text-[11px] font-medium tracking-tight text-accent/80">
          {getTimes(event.startDate)} - {getTimes(event.endDate)}
        </span>
      </div>
    </div>
  );
}
