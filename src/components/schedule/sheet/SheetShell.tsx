"use client";

import { AnimatePresence, motion } from "motion/react";

import { fadeQuick, springFirm, springSoft } from "@/src/lib/motion";
import { cn } from "@/src/utils/cn";

/** 백드롭 + 시트 컨테이너. 데스크톱은 가운데 다이얼로그, 모바일은 바텀시트 */
export default function SheetShell({
  open,
  isDesktop,
  label,
  onClose,
  children,
}: {
  open: boolean;
  isDesktop: boolean;
  label: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="sheet-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={fadeQuick}
          className="fixed inset-0 z-40 bg-black/55"
          onClick={onClose}
        />
      )}

      {open && (
        <motion.section
          key="sheet"
          role="dialog"
          aria-modal="true"
          aria-label={label}
          initial={
            isDesktop
              ? { opacity: 0, scale: 0.94, x: "-50%", y: "-46%" }
              : { y: "100%" }
          }
          animate={
            isDesktop
              ? { opacity: 1, scale: 1, x: "-50%", y: "-50%" }
              : { y: 0 }
          }
          exit={
            isDesktop
              ? {
                  opacity: 0,
                  scale: 0.97,
                  x: "-50%",
                  y: "-48%",
                  transition: fadeQuick,
                }
              : { y: "100%", transition: springFirm }
          }
          transition={isDesktop ? springSoft : springFirm}
          className={cn(
            "neu-float fixed z-50 flex flex-col bg-surface text-foreground",
            "inset-x-0 bottom-0 max-h-[88dvh] rounded-t-[28px]",
            "lg:inset-auto lg:left-1/2 lg:top-1/2 lg:w-[560px] lg:max-h-[calc(100dvh-4rem)] lg:rounded-[var(--radius-outer)]",
          )}
        >
          <span
            aria-hidden
            className="mx-auto mt-2.5 h-1 w-10 shrink-0 rounded-full bg-divider lg:hidden"
          />
          {children}
        </motion.section>
      )}
    </AnimatePresence>
  );
}
