"use client";

import { useEffect, useRef, useState } from "react";

import { cn } from "@/src/utils/cn";

type DropdownMenuProps = {
  trigger: (isOpen: boolean) => React.ReactNode;
  children: (close: () => void) => React.ReactNode;
  label: string;
  align?: "left" | "right" | "stretch";
  className?: string;
  panelClassName?: string;
  triggerClassName?: string;
  disabled?: boolean;
};

const ALIGN = {
  left: "left-0",
  right: "right-0",
  stretch: "left-0 right-0",
} as const;

export default function DropdownMenu({
  trigger,
  children,
  label,
  align = "right",
  panelClassName,
  triggerClassName,
  className,
  disabled = false,
}: DropdownMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  const close = () => setIsOpen(false);

  useEffect(() => {
    if (!isOpen) return;

    const onPointerDown = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) close();
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };

    window.addEventListener("mousedown", onPointerDown);
    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("mousedown", onPointerDown);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen]);

  return (
    <div className={cn("relative", className)} ref={wrapRef}>
      <button
        type="button"
        onClick={() => !disabled && setIsOpen((v) => !v)}
        aria-haspopup={disabled ? undefined : "menu"}
        aria-expanded={disabled ? undefined : isOpen}
        aria-label={disabled ? undefined : label}
        className={cn(
          "btn-spring flex items-center gap-1.5 rounded-lg",
          disabled && "cursor-default",
          triggerClassName,
        )}
      >
        {trigger(isOpen)}
      </button>

      {isOpen && (
        <div
          role="menu"
          className={cn(
            "absolute top-full z-50 mt-2 rounded-2xl p-2",
            "bg-surface border border-divider shadow-[var(--shadow-float)]",
            ALIGN[align],
            panelClassName,
          )}
        >
          {children(close)}
        </div>
      )}
    </div>
  );
}
