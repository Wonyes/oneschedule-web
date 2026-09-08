import { Globe, Lock, ShieldCheck } from "lucide-react";

import { Row } from "../ui/layout/flex";
import { GroupVisibility } from "@/src/types/group";
import { cn } from "@/src/utils/cn";

export const VISIBILITY_META: Record<
  GroupVisibility,
  { label: string; short: string; hint: string; tone: string }
> = {
  PRIVATE: {
    label: "비공개",
    short: "비공개",
    hint: "초대 코드를 아는 사람만 들어올 수 있어요.",
    tone: "text-place-h",
  },
  PUBLIC_OPEN: {
    label: "공개 · 즉시 가입",
    short: "즉시 가입",
    hint: "그룹 목록에 노출되고 누구나 바로 참여할 수 있어요.",
    tone: "text-accent",
  },
  PUBLIC_APPROVAL: {
    label: "공개 · 승인 후",
    short: "승인 후",
    hint: "목록에는 보이지만 관리자가 승인해야 참여할 수 있어요.",
    tone: "text-pending-500",
  },
};

export function visibilityIcon(
  visibility: GroupVisibility,
  size = 12,
): React.ReactNode {
  const props = { size, strokeWidth: 2 } as const;

  if (visibility === "PUBLIC_OPEN") return <Globe {...props} />;
  if (visibility === "PUBLIC_APPROVAL") return <ShieldCheck {...props} />;
  return <Lock {...props} />;
}

/** 현재 공개 상태 표시. 변경은 GroupSettingBody에서 한다. */
export default function VisibilityBadge({
  visibility,
  className,
}: {
  visibility?: GroupVisibility;
  className?: string;
}) {
  // 서버가 값을 안 내려주는 경우가 있어 비공개로 떨어뜨린다
  const current = visibility ?? "PRIVATE";
  const { label, tone } = VISIBILITY_META[current] ?? VISIBILITY_META.PRIVATE;

  return (
    <Row
      className={cn(
        "neu-flat w-fit shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1",
        className,
      )}
    >
      <span className={cn("shrink-0", tone)}>{visibilityIcon(current)}</span>
      <span className="typo-caption-3 whitespace-nowrap text-secondary">
        {label}
      </span>
    </Row>
  );
}
