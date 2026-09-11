"use client";

import { useRef } from "react";
import { AnimatePresence, motion } from "motion/react";

import { Row } from "@/src/components/ui/layout/flex";
import { springSnappy, springSoft } from "@/src/lib/motion";

const slide = {
  enter: (direction: number) => ({ x: direction * 48, opacity: 0 }),
  center: { x: 0, opacity: 1, transition: springSoft },
  exit: (direction: number) => ({
    x: direction * -32,
    opacity: 0,
    transition: { duration: 0.16 },
  }),
};

export function StepProgress({
  total,
  current,
  label,
}: {
  total: number;
  current: number;
  label: string;
}) {
  return (
    <Row className="gap-1.5" role="list" aria-label={label}>
      {Array.from({ length: total }, (_, i) => (
        <span
          key={i}
          role="listitem"
          aria-current={i === current ? "step" : undefined}
          className="relative h-1.5 flex-1 overflow-hidden rounded-full bg-surface-hover"
        >
          <motion.span
            initial={false}
            animate={{ scaleX: i <= current ? 1 : 0 }}
            transition={springSnappy}
            className="absolute inset-0 origin-left rounded-full bg-accent"
          />
        </span>
      ))}
    </Row>
  );
}

export function StepSlide({
  stepKey,
  direction,
  children,
}: {
  stepKey: string;
  direction: number;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);

  return (
    <div className="relative -m-2 overflow-hidden p-2">
      <AnimatePresence mode="wait" custom={direction} initial={false}>
        <motion.div
          key={stepKey}
          ref={ref}
          custom={direction}
          variants={slide}
          initial="enter"
          animate="center"
          exit="exit"
          onAnimationStart={(definition) => {
            if (definition !== "center") return;
            ref.current?.querySelector("input")?.focus({ preventScroll: true });
          }}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
