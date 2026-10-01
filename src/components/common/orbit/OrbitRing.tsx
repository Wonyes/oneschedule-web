"use client";

import { motion } from "motion/react";

import { useMediaQuery } from "@/src/hooks/useMediaQuery";
import { springSnappy } from "@/src/lib/motion";
import { cn } from "@/src/utils/cn";
import { Comet } from "../Plate";

const SPIN = { duration: 60, ease: "linear", repeat: Infinity } as const;

/** 링 지름과 위성 궤도 반지름 프리셋 */
const SIZE = {
  sm: { className: "h-48 w-48", radius: 76 },
  md: { className: "h-52 w-52", radius: 80 },
  lg: { className: "h-56 w-56", radius: 92 },
  xl: { className: "h-60 w-60", radius: 96 },
} as const;

export type OrbitSize = keyof typeof SIZE;

export interface OrbitItem {
  key: string | number;
  node: React.ReactNode;
}

/** 위성으로 보여줄 만큼만 자르고, 잘린 개수를 같이 돌려준다 */
export function splitSatellites<T>(list: T[], max: number) {
  const shown = list.slice(0, max);
  return { shown, hidden: list.length - shown.length };
}

export default function OrbitRing({
  size = "md",
  wideSize,
  radius,
  center,
  items,
  className,
}: {
  /** 기본 프리셋. `radius`를 직접 주면 무시된다 */
  size?: OrbitSize;
  /** sm 브레이크포인트 이상에서 쓸 프리셋 */
  wideSize?: OrbitSize;
  radius?: number;
  center: React.ReactNode;
  items: OrbitItem[];
  className?: string;
}) {
  const wide = useMediaQuery("(min-width: 640px)");
  const preset = SIZE[wide && wideSize ? wideSize : size];
  const orbitRadius = radius ?? preset.radius;

  return (
    <div
      className={cn(
        "relative mx-auto flex shrink-0 items-center justify-center",
        radius === undefined && preset.className,
        className,
      )}
    >
      <div className="absolute inset-0 rounded-full glow-blob" />
      <div className="neu-pressed absolute inset-2 rounded-full" />
      <motion.div
        aria-hidden
        className="absolute inset-[9%] rounded-full border border-dashed border-divider/70"
        animate={{ rotate: -360 }}
        transition={{ duration: 180, ease: "linear", repeat: Infinity }}
      />
      <motion.div
        aria-hidden
        className="absolute inset-[24%] rounded-full border border-dashed border-divider"
        animate={{ rotate: 360 }}
        transition={{ duration: 120, ease: "linear", repeat: Infinity }}
      />
      <Comet className="absolute inset-[9%]" duration={14} />
      <Comet className="absolute inset-[24%]" duration={9} reverse />

      <motion.div
        className="relative z-10"
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ ...springSnappy, delay: 0.1 }}
      >
        {center}
      </motion.div>

      <motion.div
        className="absolute inset-0"
        animate={{ rotate: 360 }}
        transition={SPIN}
      >
        {items.map((item, i) => {
          const angle = (i / items.length) * 360 - 90;

          return (
            <div
              key={item.key}
              className="absolute left-1/2 top-1/2"
              style={{
                transform: `rotate(${angle}deg) translateX(${orbitRadius}px) rotate(${-angle}deg)`,
              }}
            >
              <motion.div
                className="-translate-x-1/2 -translate-y-1/2"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ ...springSnappy, delay: 0.35 + i * 0.08 }}
              >
                <motion.div animate={{ rotate: -360 }} transition={SPIN}>
                  {item.node}
                </motion.div>
              </motion.div>
            </div>
          );
        })}
      </motion.div>
    </div>
  );
}
