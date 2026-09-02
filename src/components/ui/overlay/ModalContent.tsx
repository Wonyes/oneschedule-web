import React from "react";
import TitleHeader from "../layout/TitleHeader";

interface ModalContentProps {
  show: boolean;
  title: string;
  children: React.ReactNode;
  buttons: React.ReactNode;
}

export default function ModalContent({
  show,
  title,
  children,
  buttons,
}: ModalContentProps) {
  if (!show) return null;

  return (
    <>
      {/* Dimmed Background */}
      <div className="fixed inset-0 z-[9990] bg-black/70 transition-opacity duration-300 opacity-100" />

      {/* Modal Box */}
      <div className="fixed left-1/2 top-1/2 z-[9999] flex w-[calc(100%-32px)] max-w-[500px] -translate-x-1/2 -translate-y-1/2 flex-col justify-between rounded-[20px] glass transition-all duration-300 text-foreground">
        <div className="flex items-center justify-between px-[30px] pt-[24px] pb-[16px] m-0">
          <TitleHeader title={title} pad="0" className="text-[20px]" />
        </div>

        <div className="flex-grow px-[30px] pb-[20px] text-secondary">
          {children}
        </div>

        <div className="flex items-center justify-end gap-[12px] rounded-b-[20px] bg-black/20 border-t border-white/10 px-[30px] py-[16px]">
          {buttons}
        </div>
      </div>
    </>
  );
}
