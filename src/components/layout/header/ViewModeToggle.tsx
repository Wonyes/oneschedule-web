"use client";

import { usePathname } from "next/navigation";

import { useScheduleStore } from "@/src/hooks/stores/useScheduleStore";

const labels = {
  day: "일",
  week: "주",
  month: "월",
};

const views = ["day", "week", "month"] as const;

export default function ViewModeToggle() {
  const { mode, setMode } = useScheduleStore();
  const pathname = usePathname();

  const activeIndex = views.indexOf(mode);

  if (pathname !== "/schedule") return null;

  return (
    <div className="relative flex h-9 w-[84px] rounded-xl neu-pressed p-1 lg:w-[108px]">
      <div
        className="absolute inset-y-1 left-1 rounded-md neu-flat transition-transform duration-300"
        style={{
          width: `calc(${100 / views.length}% - 2.7px)`,
          transform: `translateX(${Math.max(activeIndex, 0) * 100}%)`,
        }}
      />

      {views.map((view) => (
        <button
          key={view}
          type="button"
          onClick={() => setMode(view)}
          className={`relative z-10 flex-1 typo-caption-3 font-semibold ${
            mode === view ? "text-accent" : "text-secondary"
          }`}
        >
          {labels[view]}
        </button>
      ))}
    </div>
  );
}
