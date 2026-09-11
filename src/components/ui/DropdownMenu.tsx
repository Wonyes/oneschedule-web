"use client";

import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "motion/react";

import { cn } from "@/src/utils/cn";
import { fadeQuick, springSnappy } from "@/src/lib/motion";

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

const noop = () => () => {};

type PanelPosition = {
  top: number;
  left: number;
  width?: number;
  origin: string;
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
  const mounted = useSyncExternalStore(
    noop,
    () => true,
    () => false,
  );

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
      const origin = `${flipUp ? "bottom" : "top"} ${align === "right" ? "right" : "left"}`;

      const width =
        align === "stretch"
          ? anchor.width
          : (panelRef.current?.offsetWidth ?? 0);
      const wanted = align === "right" ? anchor.right - width : anchor.left;
      const maxLeft = window.innerWidth - width - GAP;
      const left = Math.max(GAP, Math.min(wanted, maxLeft));

      setPosition(
        align === "stretch"
          ? { top, left, width: anchor.width, origin }
          : { top, left, origin },
      );
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

      {mounted &&
        createPortal(
          <AnimatePresence>
            {isOpen && (
              <motion.div
                ref={panelRef}
                role="menu"
                initial={{ opacity: 0, scale: 0.94, y: -6 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, y: -4, transition: fadeQuick }}
                transition={springSnappy}
                style={{
                  position: "fixed",
                  top: position?.top ?? -9999,
                  left: position?.left,
                  width: position?.width,
                  visibility: position ? "visible" : "hidden",
                  transformOrigin: position?.origin,
                }}
                className={cn(
                  "z-[1000] rounded-2xl p-2",
                  "bg-surface border border-divider shadow-[var(--shadow-float)]",
                  panelClassName,
                )}
              >
                {children(close)}
              </motion.div>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </div>
  );
}
