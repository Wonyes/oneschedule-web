"use client";

import { useScheduleStore } from "@/src/hooks/stores/useScheduleStore";

const labels = {
  day: "일",
  week: "주",
  month: "월",
};

const views = ["day", "week", "month"] as const;

export default function ViewModeToggle() {
  const { mode, setMode } = useScheduleStore();

  const activeIndex = views.indexOf(mode);

  return (
    <div className="relative flex h-9 w-[120px] shrink-0 rounded-xl neu-pressed p-1">
      <div
        className="absolute inset-y-1 left-1 rounded-lg neu-flat transition-transform duration-300"
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
