"use client";

import { CalendarClock } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Logo() {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={() => router.push("/")}
      className="flex items-center gap-2 shrink-0"
      aria-label="홈으로 이동"
    >
      <span
        className="
          flex h-7 w-7 shrink-0 items-center justify-center
          rounded-lg
          bg-accent/12
        "
      >
        <CalendarClock size={15} strokeWidth={1.75} className="text-accent" />
      </span>

      <span className="hidden items-baseline gap-1 sm:flex">
        <span className="typo-sub-t-2 font-bold text-foreground tracking-tight">
          ONE
        </span>
        <span className="typo-sub-t-2 font-medium text-muted tracking-tight">
          Scheduler
        </span>
      </span>
    </button>
  );
}
