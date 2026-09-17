"use client";

import { AnimatePresence } from "motion/react";

import ScrollListArea, {
  ScrollSentinel,
} from "@/src/components/ui/ScrollListArea";
import { useMemberPresence } from "@/src/hooks/querys/useGroup";
import { useMyInfo } from "@/src/hooks/querys/useMembers";
import { useIncrementalList } from "@/src/hooks/useIncrementalList";
import { PAGE_SIZE } from "@/src/lib/paging";
import { GroupMember, roleOf } from "@/src/types/group";
import MemberRow from "./MemberRow";
import { useManageMember } from "./useManageMember";

export default function GroupMemberList({
  members,
  manager,
  groupNo,
}: {
  members: GroupMember[];
  /** 보는 사람이 관리자면 멤버 관리 메뉴가 보인다 */
  manager: boolean;
  groupNo: number;
}) {
  const { data: myInfo } = useMyInfo();
  const { data: presence } = useMemberPresence(groupNo);
  const { edit, kick } = useManageMember(groupNo);
  const { visible, hasMore, rootRef, sentinelRef } = useIncrementalList(
    members,
    PAGE_SIZE.groupMembers,
  );

  // 그룹장과 나 자신은 관리 대상이 아니다
  const canManage = (member: GroupMember) =>
    manager &&
    !roleOf(member.groupRole).owner &&
    member.memberNo !== myInfo?.memberNo;

  return (
    <ScrollListArea
      rootRef={rootRef}
      showFade={hasMore}
      className="scroll-hidden flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto pb-3"
    >
      <AnimatePresence initial={false} mode="popLayout">
        {visible.map((member) => (
          <MemberRow
            key={member.memberNo}
            member={member}
            presence={presence}
            canManage={canManage(member)}
            onEdit={() => edit(member)}
            onKick={() => kick(member)}
          />
        ))}
      </AnimatePresence>

      {hasMore && <ScrollSentinel sentinelRef={sentinelRef} />}
    </ScrollListArea>
  );
}
