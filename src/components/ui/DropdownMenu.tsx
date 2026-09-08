"use client";

import { useEffect, useRef, useState } from "react";

import { cn } from "@/src/utils/cn";

type DropdownMenuProps = {
  /** 버튼 안에 들어갈 내용. 열림 상태에 따라 화살표 등을 바꿀 수 있다. */
  trigger: (isOpen: boolean) => React.ReactNode;
  /** 패널 내용. close를 받아 항목 선택 후 닫을 수 있다. */
  children: (close: () => void) => React.ReactNode;
  label: string;
  align?: "left" | "right" | "stretch";
  /** 트리거를 폭에 맞춰야 할 때 바깥 래퍼에 준다 */
  className?: string;
  panelClassName?: string;
  triggerClassName?: string;
  disabled?: boolean;
};

const ALIGN = {
  left: "left-0",
  right: "right-0",
  stretch: "left-0 right-0",
} as const;

/**
 * 헤더·시트 등 여러 곳에서 쓰는 드롭다운.
 * 바깥 클릭/ESC 닫기와 패널 스타일을 한곳에서 관리한다.
 * 패널은 불투명하다 — 반투명이면 뒤 내용이 비쳐 읽기 어렵다.
 */
export default function DropdownMenu({
  trigger,
  children,
  label,
  align = "right",
  panelClassName,
  triggerClassName,
  className,
  disabled = false,
}: DropdownMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  const close = () => setIsOpen(false);

  useEffect(() => {
    if (!isOpen) return;

    const onPointerDown = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) close();
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };

    window.addEventListener("mousedown", onPointerDown);
    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("mousedown", onPointerDown);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen]);

  return (
    <div className={cn("relative", className)} ref={wrapRef}>
      <button
        type="button"
        onClick={() => !disabled && setIsOpen((v) => !v)}
        aria-haspopup={disabled ? undefined : "menu"}
        aria-expanded={disabled ? undefined : isOpen}
        aria-label={disabled ? undefined : label}
        className={cn(
          "btn-spring flex items-center gap-1.5 rounded-lg",
          disabled && "cursor-default",
          triggerClassName,
        )}
      >
        {trigger(isOpen)}
      </button>

      {isOpen && (
        <div
          role="menu"
          className={cn(
            "absolute top-full z-50 mt-2 rounded-2xl p-2",
            "bg-surface border border-divider shadow-[var(--shadow-float)]",
            ALIGN[align],
            panelClassName,
          )}
        >
          {children(close)}
        </div>
      )}
    </div>
  );
}
