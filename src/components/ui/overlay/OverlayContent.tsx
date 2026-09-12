"use client";

import { AlertCircle, Info } from "lucide-react";
import { motion } from "motion/react";

import { springSnappy } from "@/src/lib/motion";
import { cn } from "@/src/utils/cn";
import OverlayShell from "./OverlayShell";
import { OverlayLayer } from "./layer";

interface OverlayContentProps {
  show: boolean;
  title: string;
  message?: string;
  message2?: string;
  message3?: string;
  buttons: React.ReactNode;
  layer: OverlayLayer;
}

export default function OverlayContent({
  show,
  title,
  message,
  message2,
  message3,
  buttons,
  layer,
}: OverlayContentProps) {
  const confirm = layer === "confirm";
  const Icon = confirm ? AlertCircle : Info;

  return (
    <OverlayShell show={show} layer={layer} className="max-w-[340px]">
      <div className="flex flex-col items-center px-6 pt-7 text-center">
        <motion.span
          initial={{ scale: 0.4, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ ...springSnappy, delay: 0.08 }}
          className={cn(
            "neu-btn flex h-12 w-12 items-center justify-center rounded-2xl",
            confirm ? "text-pending-500" : "text-accent",
          )}
        >
          <Icon size={22} strokeWidth={1.75} />
        </motion.span>

        <h3 className="mt-4 typo-sub-t-1 text-foreground">{title}</h3>

        {(message || message2 || message3) && (
          <div className="mt-1.5 flex flex-col gap-0.5 whitespace-pre-line break-words typo-caption-1 text-muted">
            {message && <p>{message}</p>}
            {message2 && <p>{message2}</p>}
            {message3 && <p>{message3}</p>}
          </div>
        )}
      </div>

      <div className="flex items-center gap-2.5 px-6 pb-6 pt-6">{buttons}</div>
    </OverlayShell>
  );
}
