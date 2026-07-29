import { cn } from "@/src/utils/cn";
import * as React from "react";

type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={cn(
          "w-full rounded-xl border border-divider bg-white px-4 py-3 text-sm outline-none transition",
          "placeholder:text-muted",
          "focus:border-primary focus:ring-2 focus:ring-primary/10",
          "disabled:cursor-not-allowed disabled:opacity-50",
          "resize-none",
          className,
        )}
        {...props}
      />
    );
  },
);

Textarea.displayName = "Textarea";

export { Textarea };
