import { cn } from "@/src/utils/cn";
import * as React from "react";

type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  description?: string;
  errorMessage?: string;
  showCount?: boolean;
};

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    { className, description, errorMessage, showCount = true, ...props },
    ref,
  ) => {
    const length = String(props.value ?? "").length;
    const max = props.maxLength;

    return (
      <div className="flex w-full flex-col gap-1.5">
        <div
          className={cn(
            "neu-pressed w-full rounded-xl transition",
            "focus-within:ring-2 focus-within:ring-indigo-500/30",
            className,
          )}
        >
          <textarea
            ref={ref}
            rows={3}
            className="
              block w-full resize-none
              bg-transparent
              px-4 py-3
              typo-caption-2 text-foreground
              outline-none
              placeholder:text-muted
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
            {...props}
          />
        </div>

        {(description || errorMessage || (showCount && max)) && (
          <div className="flex items-start justify-between gap-2 px-1">
            <span
              className={cn(
                "typo-caption-3",
                errorMessage ? "text-error-500" : "text-place-h",
              )}
            >
              {errorMessage ?? description}
            </span>

            {showCount && max && (
              <span className="typo-caption-3 shrink-0 text-place-h tabular-nums">
                {length} / {max}
              </span>
            )}
          </div>
        )}
      </div>
    );
  },
);

Textarea.displayName = "Textarea";

export { Textarea };
