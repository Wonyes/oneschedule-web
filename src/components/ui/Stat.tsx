"use client";

import { useEffect } from "react";
import { animate, motion, useMotionValue, useTransform } from "motion/react";

import { cn } from "@/src/utils/cn";
import { Row } from "./layout/flex";

const TONE = {
  success: "text-success-500",
  pending: "text-pending-500",
} as const;

/** 라벨 + 숫자. tone은 값이 0보다 클 때만 칠해진다 */
export default function Stat({
  label,
  value,
  tone,
  countUp = false,
}: {
  label: string;
  value: number;
  tone?: keyof typeof TONE;
  /** 0에서 값까지 올라가는 애니메이션 */
  countUp?: boolean;
}) {
  const color = tone && value > 0 ? TONE[tone] : "text-foreground";

  return (
    <Row className="items-baseline gap-1">
      <span className="typo-caption-3 text-place-h">{label}</span>
      {countUp ? (
        <CountUp value={value} className={color} />
      ) : (
        <span
          className={cn("typo-caption-1 font-semibold tabular-nums", color)}
        >
          {value}
        </span>
      )}
    </Row>
  );
}

function CountUp({ value, className }: { value: number; className: string }) {
  const count = useMotionValue(0);
  const text = useTransform(count, (v) => Math.round(v).toString());

  useEffect(() => {
    const controls = animate(count, value, {
      duration: 0.9,
      ease: "easeOut",
      delay: 0.3,
    });
    return () => controls.stop();
  }, [count, value]);

  return (
    <motion.span
      className={cn("typo-caption-1 font-semibold tabular-nums", className)}
    >
      {text}
    </motion.span>
  );
}
