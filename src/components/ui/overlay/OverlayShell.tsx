"use client";

import { AnimatePresence, motion } from "motion/react";

import { fadeQuick, springSoft } from "@/src/lib/motion";
import { cn } from "@/src/utils/cn";
import { OVERLAY_LAYER, OverlayLayer } from "./layer";

const centered = { x: "-50%", y: "-50%" };

export default function OverlayShell({
  show,
  layer,
  className,
  children,
}: {
  show: boolean;
  layer: OverlayLayer;
  className?: string;
  children: React.ReactNode;
}) {
  const z = OVERLAY_LAYER[layer];

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="backdrop"
          className={`fixed inset-0 ${z.backdrop} bg-black/70`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={fadeQuick}
        />
      )}

      {show && (
        <motion.div
          key="box"
          role="dialog"
          aria-modal="true"
          className={cn(
            "fixed left-1/2 top-1/2 flex w-[calc(100%-32px)] flex-col text-foreground",
            z.box,
            className,
          )}
          initial={{ ...centered, opacity: 0, scale: 0.96 }}
          animate={{ ...centered, opacity: 1, scale: 1 }}
          exit={{ ...centered, opacity: 0, scale: 0.97, transition: fadeQuick }}
          transition={springSoft}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
