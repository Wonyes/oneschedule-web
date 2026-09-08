"use client";

import AvatarImage from "@/src/components/common/AvatarImage";
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
                <span
                  key={m.memberNo}
                  className="ring-surface flex h-5 w-5 items-center justify-center overflow-hidden rounded-full bg-accent/20 text-[9px] font-bold text-accent ring-2"
                >
                  <AvatarImage src={m.profileImageUrl} nickname={m.nickname} />
                </span>
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
