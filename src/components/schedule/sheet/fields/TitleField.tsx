"use client";

import { EVENT_STYLES } from "@/src/constant/schedule";
import { EventCategory } from "@/src/types/schedule";
import { cn } from "@/src/utils/cn";
import { FieldLabel } from "../SheetParts";

const MAX = 30;

export default function TitleField({
  value,
  category,
  error,
  readOnly,
  autoFocus,
  onChange,
}: {
  value: string;
  category: EventCategory | "";
  error: string;
  readOnly: boolean;
  autoFocus: boolean;
  onChange: (value: string) => void;
}) {
  const dot = EVENT_STYLES[category as keyof typeof EVENT_STYLES]?.dot;

  return (
    <div className="flex flex-col gap-2">
      <FieldLabel required>TITLE</FieldLabel>
      <label
        className="neu-input flex h-14 items-center gap-3 rounded-xl px-4"
        data-invalid={error ? "true" : undefined}
      >
        <span
          aria-hidden
          className={cn(
            "h-3 w-3 shrink-0 rounded-full transition-colors",
            dot ?? "bg-accent",
          )}
        />
        <input
          value={value}
          required
          maxLength={MAX}
          readOnly={readOnly}
          autoFocus={autoFocus}
          aria-label="제목"
          aria-invalid={!!error}
          onChange={(e) => onChange(e.target.value)}
          placeholder="무슨 일정인가요?"
          className="w-full bg-transparent typo-sub-t-1 font-semibold tracking-tight text-foreground outline-none placeholder:font-medium placeholder:text-place-h"
        />
        <span className="shrink-0 typo-caption-3 tabular-nums text-place-h">
          {value.length}/{MAX}
        </span>
      </label>
      {error && <p className="typo-caption-3 text-error-500">{error}</p>}
    </div>
  );
}
