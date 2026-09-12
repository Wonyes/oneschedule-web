"use client";

import { ChevronRight, Crown, Users } from "lucide-react";

import BaseCard from "../ui/card/BaseCard";
import { Column, Row } from "../ui/layout/flex";
import IconBox from "../ui/IconBox";
import { useActiveGroupStore } from "@/src/hooks/stores/useActiveGroupStore";
import { MyGroupResponse } from "@/src/types/group";
import GroupAvatar from "./GroupAvatar";

export default function GroupPicker({
  groups,
  description = "어떤 그룹의 일정을 볼지 골라주세요.",
}: {
  groups: MyGroupResponse[];
  description?: string;
}) {
  const setActiveGroup = useActiveGroupStore((s) => s.setActiveGroup);
  return (
    <BaseCard className="mx-auto w-full max-w-[420px] p-6" glow>
      <Column className="mb-5 gap-1.5">
        <span className="eyebrow">SELECT GROUP</span>
        <span className="typo-title-2 text-foreground">그룹 선택</span>
        <span className="typo-caption-2 text-muted">{description}</span>
      </Column>

      <Column className="w-full gap-2">
        {groups.map((group) => (
          <button
            key={group.groupNo}
            type="button"
            onClick={() => setActiveGroup(group.groupNo)}
            className="neu-flat btn-spring hover:text-foreground flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left"
          >
            {group.profileImageUrl ? (
              <GroupAvatar
                name={group.groupName}
                imageUrl={group.profileImageUrl}
                className="relative h-9 w-9 rounded-lg typo-sub-t-1"
              />
            ) : (
              <IconBox size="md">
                <Users size={16} strokeWidth={1.75} />
              </IconBox>
            )}

            <Column className="min-w-0 flex-1 gap-0.5">
              <Row className="min-w-0 items-center gap-1.5">
                <span className="typo-caption-1 text-foreground truncate font-semibold">
                  {group.groupName}
                </span>

                {group.groupRole === "SUPER" && (
                  <Crown
                    size={12}
                    strokeWidth={2}
                    className="text-pending-500 shrink-0"
                    aria-label="관리자"
                  />
                )}
              </Row>

              <span className="typo-caption-3 text-muted">
                멤버 {group.members?.length ?? 0}명
              </span>
            </Column>

            <ChevronRight
              size={16}
              strokeWidth={1.75}
              className="text-place-h shrink-0"
            />
          </button>
        ))}
      </Column>

      <p className="typo-caption-3 text-place-h mt-4 text-center">
        선택한 그룹은 저장되며, 헤더에서 언제든 바꿀 수 있어요.
      </p>
    </BaseCard>
  );
}
