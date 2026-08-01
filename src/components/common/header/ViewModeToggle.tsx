"use client";

import { useScheduleStore } from "@/src/hooks/stores/useScheduleStore";

export default function ViewModeToggle() {
  const { mode, setMode } = useScheduleStore();

  const labels = {
    day: "일",
    week: "주",
    month: "월",
  };

  return (
    <div className="relative flex rounded-xl neu-pressed p-1.5 py-3 w-[138px]">
      <div
        className={`
          absolute top-1.5 bottom-1.5
          w-[calc(33.333%-4px)]
          neu-flat rounded-lg
          transition-transform duration-300

          ${
            mode === "day"
              ? "translate-x-0"
              : mode === "week"
                ? "translate-x-full"
                : "translate-x-[200%]"
          }

          `}
      />

      {(["day", "week", "month"] as const).map((view) => (
        <button
          key={view}
          onClick={() => setMode(view)}
          className={`
        relative z-10
        w-1/3
        typo-caption-2
                  
        ${mode === view ? "text-blue" : "text-secondarty"}
                  
        `}
        >
          {labels[view]}
        </button>
      ))}
    </div>
  );
}
