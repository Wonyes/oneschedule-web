import React from "react";
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
  return (
    <OverlayShell
      show={show}
      layer={layer}
      className="max-w-[360px] overflow-hidden rounded-2xl border border-divider bg-surface shadow-2xl"
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
    </OverlayShell>
  );
}
