"use client";

import { CheckCircle2 } from "lucide-react";
import { motion } from "motion/react";

import { fadeQuick, springSnappy } from "@/src/lib/motion";

interface ToastContentProps {
  message?: string;
}

export default function ToastContent({ message }: ToastContentProps) {
  if (!message) return null;

  return (
    <motion.div
      role="status"
      initial={{ opacity: 0, y: -20, scale: 0.94 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.97, transition: fadeQuick }}
      transition={springSnappy}
      className="neu-float fixed inset-x-4 top-[calc(env(safe-area-inset-top)+5rem)] z-[10000] mx-auto flex w-fit max-w-full items-center gap-2.5 rounded-full bg-surface py-2.5 pl-3 pr-4"
    >
      <motion.span
        initial={{ scale: 0.4 }}
        animate={{ scale: 1 }}
        transition={{ ...springSnappy, delay: 0.1 }}
        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent/15 text-accent"
      >
        <CheckCircle2 size={16} strokeWidth={2} />
      </motion.span>
      <span className="whitespace-pre-line break-words typo-caption-2 font-medium text-foreground">
        {message}
      </span>
    </motion.div>
  );
}
