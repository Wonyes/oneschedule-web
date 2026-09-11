"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

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

const GAP = 8;

type PanelPosition = {
  top: number;
  left?: number;
  right?: number;
  width?: number;
};

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
  const [position, setPosition] = useState<PanelPosition | null>(null);

  const wrapRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const close = () => setIsOpen(false);

  useLayoutEffect(() => {
    if (!isOpen) return;

    const place = () => {
      const anchor = wrapRef.current?.getBoundingClientRect();
      if (!anchor) return;

      const panelHeight = panelRef.current?.offsetHeight ?? 0;
      const spaceBelow = window.innerHeight - anchor.bottom - GAP;
      const flipUp = panelHeight > spaceBelow && anchor.top > panelHeight + GAP;

      const top = flipUp ? anchor.top - panelHeight - GAP : anchor.bottom + GAP;

      if (align === "stretch") {
        setPosition({ top, left: anchor.left, width: anchor.width });
      } else if (align === "left") {
        setPosition({ top, left: anchor.left });
      } else {
        setPosition({ top, right: window.innerWidth - anchor.right });
      }
    };

    place();

    window.addEventListener("scroll", place, true);
    window.addEventListener("resize", place);

    return () => {
      window.removeEventListener("scroll", place, true);
      window.removeEventListener("resize", place);
    };
  }, [isOpen, align]);

  useEffect(() => {
    if (!isOpen) return;

    const onPointerDown = (e: MouseEvent) => {
      const target = e.target as Node;
      const inside =
        wrapRef.current?.contains(target) || panelRef.current?.contains(target);

      if (!inside) close();
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

      {isOpen &&
        createPortal(
          <div
            ref={panelRef}
            role="menu"
            style={{
              position: "fixed",
              top: position?.top ?? -9999,
              left: position?.left,
              right: position?.right,
              width: position?.width,
              visibility: position ? "visible" : "hidden",
            }}
            className={cn(
              "z-[1000] rounded-2xl p-2",
              "bg-surface border border-divider shadow-[var(--shadow-float)]",
              panelClassName,
            )}
          >
            {children(close)}
          </div>,
          document.body,
        )}
    </div>
  );
}
