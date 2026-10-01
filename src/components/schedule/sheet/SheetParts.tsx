"use client";

import { Trash2, X } from "lucide-react";

import { GhostBtn, Primary } from "@/src/components/ui/layout/button";

export function FieldLabel({
  children,
  required = false,
}: {
  children: React.ReactNode;
  required?: boolean;
}) {
  return (
    <span className="eyebrow flex items-center gap-1.5">
      {children}
      {required && (
        <span className="rounded-full bg-accent/12 px-1.5 py-px text-[10px] font-semibold leading-4 tracking-normal text-accent">
          필수
        </span>
      )}
    </span>
  );
}

export function SheetHeader({
  onClose,
  isEditing,
  canEdit,
}: {
  onClose: () => void;
  isEditing: boolean;
  canEdit: boolean;
}) {
  return (
    <header className="flex shrink-0 items-center justify-between px-5 pt-4 sm:px-7 sm:pt-6">
      <span className="eyebrow">
        {isEditing ? (canEdit ? "EDIT SCHEDULE" : "SCHEDULE") : "NEW SCHEDULE"}
      </span>
      <button
        type="button"
        onClick={onClose}
        aria-label="닫기"
        className="neu-btn btn-spring flex h-9 w-9 items-center justify-center rounded-full text-muted hover:text-foreground"
      >
        <X size={16} strokeWidth={2} />
      </button>
    </header>
  );
}

export function SheetFooter({
  onClose,
  onSave,
  onDelete,
  isEditing,
  canEdit,
}: {
  onClose: () => void;
  onSave: () => void;
  onDelete: () => void;
  isEditing: boolean;
  canEdit: boolean;
}) {
  return (
    <footer className="flex shrink-0 items-center gap-2 border-t border-divider px-5 pb-[calc(1rem+env(safe-area-inset-bottom))] pt-4 sm:px-7 lg:pb-5">
      {isEditing && canEdit && (
        <button
          type="button"
          onClick={onDelete}
          className="btn-spring flex h-10 items-center gap-1.5 rounded-xl px-3 typo-caption-2 font-medium text-place-h hover:text-error-500"
        >
          <Trash2 size={14} strokeWidth={1.75} />
          삭제
        </button>
      )}

      <div className="ml-auto flex items-center gap-2">
        <GhostBtn
          text={canEdit ? "취소" : "닫기"}
          onClick={onClose}
          className="h-10 rounded-xl px-4 typo-caption-2"
        />
        {canEdit && (
          <Primary
            text={isEditing ? "저장" : "추가"}
            onClick={onSave}
            className="h-10 rounded-xl px-6 typo-caption-2"
          />
        )}
      </div>
    </footer>
  );
}
