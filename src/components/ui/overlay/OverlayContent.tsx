import React from "react";

interface OverlayContentProps {
  show: boolean;
  title: string;
  message?: string;
  message2?: string;
  message3?: string;
  buttons: React.ReactNode;
}

export default function OverlayContent({
  show,
  title,
  message,
  message2,
  message3,
  buttons,
}: OverlayContentProps) {
  if (!show) return null;

  return (
    <>
      <div className="fixed inset-0 z-[9990] bg-black/60 transition-opacity duration-300 opacity-100" />

      <div className="fixed left-1/2 top-1/2 z-[9999] flex w-[calc(100%-200px)] max-w-[320px] -translate-x-1/2 -translate-y-1/2 flex-col justify-between rounded-[20px] bg-white shadow-[0_10px_40px_rgba(0,0,0,0.15)] transition-all duration-300">
        <div className="flex items-center justify-between px-[20px] pt-[24px] pb-[16px] m-0">
          <span className="typo-title-2 font-bold text-[#2b3674]">{title}</span>
        </div>

        <div className="flex flex-grow flex-col px-[20px] pb-[10px] space-y-2">
          {message && <p className="typo-body-2">{message}</p>}
          {message2 && <p className="typo-body-2">{message2}</p>}
          {message3 && <p className="typo-body-2">{message3}</p>}
        </div>

        <div className="flex items-center justify-end gap-[12px] rounded-b-[20px] bg-[#f8f9fc] px-[20px] py-[16px]">
          {buttons}
        </div>
      </div>
    </>
  );
}
