"use client";

import { motion } from "motion/react";

import { springSoft } from "@/src/lib/motion";
import { cn } from "@/src/utils/cn";

const SIZES = {
  wide: "lg:[--plate:min(640px,100dvh-9rem,50vw-1.5rem)]",
  compact: "lg:[--plate:min(560px,100dvh-11rem)]",
} as const;

export default function Plate({
  size,
  className,
  children,
}: {
  size: keyof typeof SIZES;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "relative isolate lg:flex lg:h-[var(--plate)] lg:w-[var(--plate)] lg:items-center lg:justify-center",
        SIZES[size],
        className,
      )}
    >
      <motion.div
        aria-hidden
        className="neu-pressed pointer-events-none absolute inset-0 -z-10 hidden rounded-full lg:block"
        initial={{ scale: 0.92, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={springSoft}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-5 -z-10 hidden rounded-full border border-dashed border-divider lg:block"
        animate={{ rotate: 360 }}
        transition={{ duration: 180, ease: "linear", repeat: Infinity }}
      />
      <Comet
        className="absolute inset-5 -z-10 hidden lg:block"
        duration={40}
        reverse
      />

      {children}
    </div>
  );
}

export function Comet({
  className,
  duration,
  reverse = false,
}: {
  className: string;
  duration: number;
  reverse?: boolean;
}) {
  return (
    <motion.div
      aria-hidden
      className={cn("pointer-events-none rounded-full", className)}
      animate={{ rotate: reverse ? -360 : 360 }}
      transition={{ duration, ease: "linear", repeat: Infinity }}
    >
      <span className="absolute left-1/2 top-0 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent shadow-[0_0_8px_2px_color-mix(in_srgb,var(--accent)_55%,transparent)]" />
    </motion.div>
  );
}
