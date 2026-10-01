"use client";

import { MoreVertical } from "lucide-react";
import { motion } from "motion/react";

import MemberAvatar from "@/src/components/common/MemberAvatar";
import PresenceDot from "@/src/components/common/PresenceDot";
import DropdownMenu from "@/src/components/ui/DropdownMenu";
import { Column, Row } from "@/src/components/ui/layout/flex";
import { fadeQuick, springSoft } from "@/src/lib/motion";
import { GroupMember } from "@/src/types/group";
import { cn } from "@/src/utils/cn";
import { PresenceMap, getPresence } from "@/src/utils/presence";
import RoleBadge from "../RoleBadge";

/** 멤버 한 줄: 아바타+접속점 · 닉네임+역할 · 직책·상태. 관리 가능하면 ⋮ 메뉴 */
export default function MemberRow({
  member,
  presence,
  canManage,
  onEdit,
  onKick,
}: {
  member: GroupMember;
  presence: PresenceMap;
  canManage: boolean;
  onEdit: () => void;
  onKick: () => void;
}) {
  const { online, label } = getPresence(presence, member.memberNo);

  return (
    <motion.div
      layout
      exit={{ opacity: 0, x: 24, transition: fadeQuick }}
      transition={springSoft}
      className="group flex w-full items-center gap-3 rounded-lg px-2 py-2 transition-colors hover:bg-surface-hover"
    >
      <span className="relative shrink-0">
        <MemberAvatar nickname={member.nickname} src={member.profileImageUrl} />
        <PresenceDot online={online} title={label} />
      </span>

      <Column className="min-w-0 flex-1 gap-0">
        <Row className="min-w-0 gap-1.5">
          <span className="truncate typo-caption-2 font-semibold text-foreground">
            {member.nickname}
          </span>
          <RoleBadge role={member.groupRole} />
        </Row>
        <span
          className={cn(
            "truncate typo-caption-3",
            online ? "text-success-500" : "text-place-h",
          )}
        >
          {member.position ? `${member.position} · ` : ""}
          {label}
        </span>
      </Column>

      {canManage && (
        <DropdownMenu
          label="멤버 관리 메뉴"
          align="right"
          panelClassName="w-40 glass"
          className="lg:opacity-0 lg:transition-opacity lg:focus-within:opacity-100 lg:group-hover:opacity-100"
          triggerClassName="h-7 w-7 justify-center rounded-lg text-muted hover:bg-surface-hover hover:text-foreground"
          trigger={() => <MoreVertical size={15} strokeWidth={1.75} />}
        >
          {(close) => (
            <>
              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  close();
                  onEdit();
                }}
                className="w-full rounded-lg px-3 py-2 text-left typo-caption-2 text-secondary hover:bg-surface-hover"
              >
                멤버 수정
              </button>
              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  close();
                  onKick();
                }}
                className="mt-1 w-full rounded-lg px-3 py-2 text-left typo-caption-2 text-error-500 hover:bg-surface-hover"
              >
                그룹 내보내기
              </button>
            </>
          )}
        </DropdownMenu>
      )}
    </motion.div>
  );
}
