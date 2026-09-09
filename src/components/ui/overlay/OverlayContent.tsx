import React from "react";
import { OVERLAY_LAYER, OverlayLayer } from "./layer";

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
  if (!show) return null;

  const z = OVERLAY_LAYER[layer];

  return (
    <>
      <div
        className={`fixed inset-0 ${z.backdrop} bg-black/70 transition-opacity duration-300 opacity-100`}
      />

      <div
        className={`fixed left-1/2 top-1/2 ${z.box} flex w-[calc(100%-32px)] max-w-[360px] -translate-x-1/2 -translate-y-1/2 flex-col rounded-2xl bg-surface border border-divider shadow-2xl transition-all duration-300 text-foreground overflow-hidden`}
      >
        <div className="px-6 pt-6 pb-2">
          <h3 className="text-base font-bold text-foreground tracking-tight">
            {title}
          </h3>
        </div>

        <div className="px-6 py-2 space-y-1 text-secondary text-sm whitespace-pre-line break-words">
          {message && <p>{message}</p>}
          {message2 && <p>{message2}</p>}
          {message3 && <p>{message3}</p>}
        </div>

        <div className="px-6 pt-4 pb-6 flex items-center gap-2.5">
          {buttons}
        </div>
      </div>
    </>
  );
}
