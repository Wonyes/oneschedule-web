"use client";

import { Copy, Pencil, UserPlus } from "lucide-react";

import { GhostBtn } from "@/src/components/ui/layout/button";
import { Row } from "@/src/components/ui/layout/flex";
import { useOverlay } from "@/src/hooks/useOverlay";

/** 히어로 하단 줄: 초대 코드 · 가입 신청 N건 · 그룹 편집 · 해체/탈퇴 */
export default function GroupHeroActions({
  groupCode,
  owner,
  editing,
  pendingCount,
  onEdit,
  onRequests,
  leaveLabel,
  onLeave,
}: {
  groupCode: string;
  owner: boolean;
  editing: boolean;
  pendingCount: number;
  onEdit: () => void;
  onRequests: () => void;
  leaveLabel: string;
  onLeave: () => void;
}) {
  const { openToast } = useOverlay();

  const copyCode = () => {
    navigator.clipboard.writeText(groupCode);
    openToast({ message: "초대 코드가 복사되었습니다." });
  };

  return (
    <Row className="mt-2 w-full flex-wrap justify-center gap-2 lg:justify-start">
      <Row className="neu-pressed h-9 min-w-0 gap-2 rounded-lg pl-3 pr-1.5">
        <span className="shrink-0 typo-caption-3 text-place-h">초대 코드</span>
        <span className="min-w-0 truncate typo-caption-2 font-semibold tabular-nums text-foreground">
          {groupCode}
        </span>
        <button
          type="button"
          onClick={copyCode}
          aria-label="초대 코드 복사"
          className="neu-btn btn-spring flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-muted hover:text-foreground"
        >
          <Copy size={12} strokeWidth={1.75} />
        </button>
      </Row>

      {owner && pendingCount > 0 && (
        <button
          type="button"
          onClick={onRequests}
          className="btn-spring flex h-9 items-center gap-1.5 rounded-lg bg-accent/12 px-3 typo-caption-2 font-semibold text-accent hover:bg-accent/20"
        >
          <UserPlus size={13} strokeWidth={2} />
          가입 신청 {pendingCount}건
        </button>
      )}

      {owner && !editing && (
        <button
          type="button"
          onClick={onEdit}
          className="neu-btn btn-spring flex h-9 items-center gap-1.5 rounded-lg px-3 typo-caption-2 font-medium text-secondary hover:text-foreground"
        >
          <Pencil size={13} strokeWidth={1.75} />
          그룹 편집
        </button>
      )}

      <GhostBtn
        onClick={onLeave}
        text={leaveLabel}
        className="h-9 w-fit px-3 typo-caption-2 text-place-h hover:text-error-500 lg:ml-auto"
      />
    </Row>
  );
}
