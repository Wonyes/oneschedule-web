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
      {/* Dimmed Background */}
      <div className="fixed inset-0 z-[9990] bg-black/70  transition-opacity duration-300 opacity-100" />

      {/* Alert / Confirm Box */}
      <div className="fixed left-1/2 top-1/2 z-[9999] flex w-[calc(100%-32px)] max-w-[360px] -translate-x-1/2 -translate-y-1/2 flex-col rounded-2xl bg-surface border border-divider shadow-2xl transition-all duration-300 text-foreground overflow-hidden">
        {/* 상단 타이틀 */}
        <div className="px-6 pt-6 pb-2">
          <h3 className="text-base font-bold text-foreground tracking-tight">
            {title}
          </h3>
        </div>

        {/* 메시지 영역 */}
        <div className="px-6 py-2 space-y-1 text-secondary text-sm">
          {message && <p>{message}</p>}
          {message2 && <p>{message2}</p>}
          {message3 && <p>{message3}</p>}
        </div>

        {/* 버튼 영역 (구분선 없이 깔끔하게 배치) */}
        <div className="px-6 pt-4 pb-6 flex items-center gap-2.5">
          {buttons}
        </div>
      </div>
    </>
  );
}
