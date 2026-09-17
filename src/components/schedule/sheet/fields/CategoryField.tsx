"use client";

import { EVENT_STYLES } from "@/src/constant/schedule";
import { EventCategory } from "@/src/types/schedule";
import { cn } from "@/src/utils/cn";
import { FieldLabel } from "../SheetParts";

const CATEGORIES: { value: keyof typeof EVENT_STYLES; label: string }[] = [
  { value: "work", label: "업무" },
  { value: "personal", label: "개인" },
  { value: "meeting", label: "회의" },
  { value: "important", label: "중요" },
];

export default function CategoryField({
  value,
  readOnly,
  onChange,
}: {
  value: EventCategory | "";
  readOnly: boolean;
  onChange: (category: EventCategory) => void;
}) {
  return (
    <div className="flex flex-col gap-2">
      <FieldLabel>CATEGORY</FieldLabel>
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map((item) => {
          const active = value === item.value;
          const style = EVENT_STYLES[item.value];

          return (
            <button
              key={item.value}
              type="button"
              disabled={readOnly}
              aria-pressed={active}
              onClick={() => onChange(item.value)}
              className={cn(
                "btn-spring flex h-9 items-center gap-2 rounded-full border pl-3 pr-3.5 typo-caption-2 font-medium transition-colors",
                active
                  ? `neu-pressed font-semibold ${style.chip}`
                  : "neu-btn border-accent/20 text-secondary hover:-translate-y-0.5 hover:border-accent/50 hover:text-foreground",
              )}
            >
              <span className={cn("h-2 w-2 rounded-full", style.dot)} />
              {item.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
