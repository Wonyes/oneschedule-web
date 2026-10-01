"use client";

import { DayState } from "@/src/utils/calendar";
import { cn } from "@/src/utils/cn";

export default function CalendarDay({
  date,
  state,
  onSelect,
}: {
  date: Date;
  state: DayState;
  onSelect: (date: Date) => void;
}) {
  const day = date.getDay();

  return (
    <td className="h-10 w-10 p-0 align-middle">
      <button
        type="button"
        disabled={state.disabled}
        aria-pressed={state.selected}
        onClick={() => onSelect(date)}
        className={cn(
          "flex h-10 w-full min-w-10 items-center justify-center rounded-lg typo-caption-2 text-secondary transition-colors select-none",
          day === 0 && "text-error-500 font-medium",
          day === 6 && "text-blue font-medium",
          !state.selected &&
            !state.inRange &&
            "hover:bg-surface-hover hover:text-foreground",
          state.inRange && "rounded-none bg-accent/20 text-accent",
          state.selected &&
            "bg-accent text-on-primary font-semibold shadow-md shadow-accent/30",
          state.disabled &&
            "cursor-not-allowed opacity-25 hover:bg-transparent",
        )}
      >
        {date.getDate()}
      </button>
    </td>
  );
}
