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
          flex h-9 w-9 shrink-0 items-center justify-center
          rounded-xl
          bg-gradient-to-br from-indigo-500 to-blue-600
          shadow-sm
        "
      >
        <CalendarClock size={20} className="text-white" strokeWidth={2.25} />
      </span>

      <span className="hidden items-baseline gap-1 sm:flex">
        <span className="typo-title-2 font-extrabold text-foreground">
          ONE
        </span>
        <span className="typo-title-2 font-medium text-foreground">
          SCHEDULER
        </span>
      </span>
    </button>
  );
}
