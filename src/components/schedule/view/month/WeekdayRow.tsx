import { cn } from "@/src/utils/cn";

const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];

/** 월뷰 상단 요일 줄. compact는 모바일용 작은 회색 글자 */
export default function WeekdayRow({ compact = false }: { compact?: boolean }) {
  return (
    <div
      className={cn(
        "grid shrink-0 grid-cols-7 px-2",
        compact ? "pt-4" : "pt-3",
      )}
    >
      {WEEKDAYS.map((label, i) => (
        <div
          key={label}
          className={cn(
            "flex items-center justify-center",
            compact
              ? "h-4 text-[11px] text-muted"
              : cn(
                  "h-8 typo-caption-3 font-semibold tracking-wide",
                  i === 0
                    ? "text-error-500"
                    : i === 6
                      ? "text-blue"
                      : "text-muted",
                ),
          )}
        >
          {label}
        </div>
      ))}
    </div>
  );
}
