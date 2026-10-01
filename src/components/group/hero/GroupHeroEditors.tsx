"use client";

import { Check, X } from "lucide-react";

import { Column, Row } from "../../ui/layout/flex";
import { Input } from "../../ui/layout/input";

export function GroupEditPanel({
  name,
  onNameChange,
  description,
  onDescriptionChange,
  onSave,
  onCancel,
  saving,
}: {
  name: string;
  onNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  description: string;
  onDescriptionChange: (value: string) => void;
  onSave: () => void;
  onCancel: () => void;
  saving: boolean;
}) {
  return (
    <Column
      className="w-full max-w-[520px] gap-3 text-left"
      onKeyDown={(e) => {
        if (e.key === "Escape") onCancel();
        if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) onSave();
      }}
    >
      <Input
        name="groupName"
        label="그룹 이름"
        value={name}
        onChange={onNameChange}
        maxLength={30}
        autoFocus
        onEnter={onSave}
      />

      <Column className="w-full gap-1.5">
        <textarea
          value={description}
          onChange={(e) => onDescriptionChange(e.target.value)}
          rows={2}
          maxLength={200}
          aria-label="그룹 소개"
          placeholder="어떤 그룹인지 한두 줄로 소개해 주세요."
          className="neu-input w-full resize-none rounded-xl px-4 py-3 typo-caption-2 leading-relaxed text-foreground outline-none placeholder:text-place-h"
        />
        <Row className="w-full justify-between px-1">
          <span className="typo-caption-3 text-place-h">
            공개 그룹 목록에도 보여요
          </span>
          <span className="typo-caption-3 tabular-nums text-place-h">
            {description.length} / 200
          </span>
        </Row>
      </Column>

      <Row className="w-full justify-end gap-2">
        <button
          type="button"
          onClick={onCancel}
          disabled={saving}
          className="neu-btn btn-spring flex h-9 items-center gap-1.5 rounded-xl px-3 typo-caption-2 font-medium text-secondary hover:text-foreground disabled:opacity-40"
        >
          <X size={13} strokeWidth={2} />
          취소
        </button>
        <button
          type="button"
          onClick={onSave}
          disabled={saving}
          className="btn-primary btn-spring flex h-9 items-center gap-1.5 rounded-xl px-4 typo-caption-2 font-semibold disabled:opacity-60"
        >
          <Check size={13} strokeWidth={2.5} />
          {saving ? "저장 중…" : "저장"}
        </button>
      </Row>
    </Column>
  );
}
