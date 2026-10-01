"use client";

import { Check, Hourglass, Loader2, Plus, Users } from "lucide-react";
import { motion } from "motion/react";
import { useRouter } from "next/navigation";

import GroupAvatar from "@/src/components/common/GroupAvatar";
import { Column, Row } from "@/src/components/ui/layout/flex";
import { rise } from "@/src/lib/motion";
import { PublicGroup } from "@/src/types/group";
import { cn } from "@/src/utils/cn";
import { useJoinGroup } from "./useJoinGroup";

const badgeClass =
  "absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full text-on-primary ring-2 ring-[var(--surface)]";

/** 공개 그룹 타일. 가입됨 → 그룹으로 이동, 대기 중 → 표시만, 아니면 가입 버튼 */
export default function PublicGroupCard({ group }: { group: PublicGroup }) {
  const router = useRouter();
  const { submit, needsApproval, isPending } = useJoinGroup(group);

  return (
    <motion.div
      variants={rise}
      role={group.joined ? "link" : undefined}
      onClick={() => group.joined && router.push(`/group/${group.groupNo}`)}
      className={cn(
        "group relative flex flex-col items-center gap-2.5 rounded-2xl p-3 text-center transition-colors",
        group.joined && "cursor-pointer hover:bg-surface-hover",
      )}
    >
      <div className="relative">
        <div className="neu-pressed absolute -inset-2 rounded-full" />
        <GroupAvatar
          name={group.groupName}
          imageUrl={group.profileImageUrl}
          className="relative h-16 w-16 rounded-full typo-sub-t-1"
        />

        {group.joined ? (
          <span title="가입됨" className={cn(badgeClass, "bg-success-500")}>
            <Check size={12} strokeWidth={3} />
          </span>
        ) : group.pending ? (
          <span
            title="가입 대기 중"
            className={cn(badgeClass, "bg-pending-500")}
          >
            <Hourglass size={11} strokeWidth={2.5} />
          </span>
        ) : (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              submit();
            }}
            disabled={isPending}
            aria-label={needsApproval ? "가입 신청" : "가입하기"}
            className="btn-primary btn-spring absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full ring-2 ring-[var(--surface)] disabled:opacity-60"
          >
            {isPending ? (
              <Loader2 size={12} strokeWidth={3} className="animate-spin" />
            ) : (
              <Plus size={13} strokeWidth={3} />
            )}
          </button>
        )}
      </div>

      <Column className="w-full min-w-0 items-center gap-0.5">
        <Row className="max-w-full items-center gap-1">
          <span className="truncate typo-caption-1 font-semibold text-foreground">
            {group.groupName}
          </span>
          {needsApproval && (
            <span className="shrink-0 rounded-full bg-pending-500/12 px-1.5 text-[9px] font-semibold leading-4 text-pending-500">
              승인
            </span>
          )}
        </Row>
        <Row className="items-center gap-1 text-place-h">
          <Users size={10} strokeWidth={2} />
          <span className="typo-caption-3 tabular-nums">
            {group.memberCount}
          </span>
        </Row>
        {group.description && (
          <span className="line-clamp-2 typo-caption-3 leading-snug text-muted">
            {group.description}
          </span>
        )}
      </Column>
    </motion.div>
  );
}
