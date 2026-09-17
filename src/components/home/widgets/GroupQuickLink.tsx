"use client";

import MemberAvatar from "@/src/components/common/MemberAvatar";
import { Users } from "lucide-react";

import { Row } from "@/src/components/ui/layout/flex";
import { useActiveGroup } from "@/src/hooks/querys/useGroup";
import { MyGroupResponse } from "@/src/types/group";
import QuickLink from "./QuickLink";

const MAX_AVATARS = 4;

export default function GroupQuickLink({
  initialGroups,
  activeGroup,
}: {
  initialGroups?: MyGroupResponse[];
  activeGroup?: MyGroupResponse;
}) {
  const { groups, group } = useActiveGroup(true, initialGroups);
  const displayGroup = group ?? activeGroup;
  const groupCount = groups.length || (activeGroup ? 1 : 0);

  return (
    <QuickLink
      icon={<Users size={18} strokeWidth={1.5} />}
      title="그룹"
      href="/group"
      description={
        displayGroup ? (
          <Row className="items-center gap-2">
            <Row className="-space-x-1.5">
              {displayGroup.members.slice(0, MAX_AVATARS).map((m) => (
                <MemberAvatar
                  key={m.memberNo}
                  nickname={m.nickname}
                  src={m.profileImageUrl}
                  size="2xs"
                  className="ring-2 ring-[var(--surface)]"
                />
              ))}
            </Row>
            <span className="typo-caption-2 text-muted truncate">
              {displayGroup.groupName}
              {groupCount > 1 && ` 외 ${groupCount - 1}개`}
            </span>
          </Row>
        ) : (
          "그룹을 만들거나 참여해보세요"
        )
      }
    />
  );
}
