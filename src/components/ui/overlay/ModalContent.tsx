import React from "react";
import TitleHeader from "../layout/TitleHeader";
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
      className="max-w-[500px] justify-between rounded-[20px] glass"
    >
      <div className="flex items-center justify-between px-[30px] pt-[24px] pb-[16px] m-0">
        <TitleHeader title={title} pad="0" className="text-[20px]" />
      </div>

      <div className="flex-grow px-[30px] pb-[20px] text-secondary">
        {children}
      </div>

      <div className="flex items-center justify-end gap-[12px] rounded-b-[20px] bg-black/20 border-t border-white/10 px-[30px] py-[16px]">
        {buttons}
      </div>
    </OverlayShell>
  );
}
