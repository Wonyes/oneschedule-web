"use client";

import { useRef } from "react";
import { ArrowLeft } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

import { Primary } from "@/src/components/ui/layout/button";
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

/** 진행바 + 단계 제목 + n / N + 힌트 */
export function StepHeader({
  total,
  current,
  label,
  title,
  hint,
}: {
  total: number;
  current: number;
  label: string;
  title: string;
  hint?: string;
}) {
  return (
    <div>
      <StepProgress total={total} current={current} label={label} />

      <Row className="mt-4 items-baseline justify-between">
        <h2 className="typo-sub-t-1 text-foreground">{title}</h2>
        <span className="typo-caption-3 tabular-nums text-place-h">
          {current + 1} / {total}
        </span>
      </Row>
      {hint && <p className="typo-caption-2 mt-1 text-muted">{hint}</p>}
    </div>
  );
}

/** 뒤로가기(첫 단계 제외) + 제출 버튼 */
export function StepActions({
  canGoBack,
  busy,
  onBack,
  submitText,
}: {
  canGoBack: boolean;
  busy: boolean;
  onBack: () => void;
  submitText: string;
}) {
  return (
    <Row className="gap-2">
      {canGoBack && (
        <button
          type="button"
          onClick={onBack}
          disabled={busy}
          aria-label="이전 단계"
          className="neu-btn btn-spring flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-secondary disabled:opacity-40"
        >
          <ArrowLeft size={16} strokeWidth={2} />
        </button>
      )}

      <Primary type="submit" className="w-full py-3 sm:py-4" text={submitText} />
    </Row>
  );
}
