"use client";

import { Users } from "lucide-react";
import { useRouter } from "next/navigation";

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
  const router = useRouter();
  const { groups, group } = useActiveGroup(true, initialGroups);
  const displayGroup = group ?? activeGroup;
  const groupCount = groups.length || (activeGroup ? 1 : 0);

  return (
    <QuickLink
      icon={<Users size={18} strokeWidth={1.5} />}
      title="그룹"
      onClick={() => router.push("/group")}
      description={
        displayGroup ? (
          <Row className="items-center gap-2">
            <Row className="-space-x-1.5">
              {displayGroup.members.slice(0, MAX_AVATARS).map((m) => (
                <span
                  key={m.memberNo}
                  className="ring-surface flex h-5 w-5 items-center justify-center overflow-hidden rounded-full bg-accent/20 text-[9px] font-bold text-accent ring-2"
                >
                  {m.profileImageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={m.profileImageUrl}
                      alt={m.nickname}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    m.nickname[0]
                  )}
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
