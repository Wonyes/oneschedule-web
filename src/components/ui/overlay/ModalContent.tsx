"use client";

import OverlayShell from "./OverlayShell";
import { OverlayLayer } from "./layer";

interface ModalContentProps {
  show: boolean;
  title: string;
  children: React.ReactNode;
  buttons: React.ReactNode;
  layer?: OverlayLayer;
}

export default function ModalContent({
  show,
  title,
  children,
  buttons,
  layer = "modal",
}: ModalContentProps) {
  return (
    <OverlayShell
      show={show}
      layer={layer}
      className="max-h-[calc(100dvh-32px)] max-w-[480px]"
    >
      <div className="px-6 pb-2 pt-6">
        <h3 className="typo-title-2 text-foreground">{title}</h3>
      </div>

      <div className="scroll-hidden min-h-0 flex-1 overflow-y-auto px-6 pb-5 pt-2 text-secondary">
        {children}
      </div>

      <div className="flex items-center justify-end gap-2.5 border-t border-divider px-6 py-4">
        {buttons}
      </div>
    </OverlayShell>
  );
}
