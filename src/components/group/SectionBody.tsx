"use client";

import { motion } from "motion/react";

import { springSoft } from "@/src/lib/motion";

export default function SectionBody({
  animate,
  children,
}: {
  animate: boolean;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      initial={animate ? { opacity: 0, y: 8 } : false}
      animate={{ opacity: 1, y: 0 }}
      transition={springSoft}
      className="scroll-hidden flex min-h-0 w-full flex-1 flex-col p-2 overflow-y-auto"
    >
      {children}
    </motion.div>
  );
}
