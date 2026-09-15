"use client";

import { motion } from "motion/react";

import { springSnappy } from "@/src/lib/motion";
import { cn } from "@/src/utils/cn";
import { Comet } from "./Plate";

const SPIN = { duration: 60, ease: "linear", repeat: Infinity } as const;

export interface OrbitItem {
  key: string | number;
  node: React.ReactNode;
}

export default function OrbitRing({
  radius,
  center,
  items,
  className = "h-60 w-60",
}: {
  radius: number;
  center: React.ReactNode;
  items: OrbitItem[];
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative mx-auto flex shrink-0 items-center justify-center",
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
                transform: `rotate(${angle}deg) translateX(${radius}px) rotate(${-angle}deg)`,
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
