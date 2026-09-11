"use client";

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
      initial={{ opacity: 0, y: 8, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 4, transition: fadeQuick }}
      transition={springSnappy}
      className="fixed top-[40%] z-[10000] inset-x-4 mx-auto w-fit max-w-full sm:inset-x-auto sm:left-[55%] sm:mx-0 sm:-translate-x-1/2 sm:max-w-[728px] flex items-center rounded-2xl bg-accent px-5 py-3 shadow-xl"
    >
      <span className="whitespace-pre-line break-words text-white text-xs font-semibold">
        {message}
      </span>
    </motion.div>
  );
}
