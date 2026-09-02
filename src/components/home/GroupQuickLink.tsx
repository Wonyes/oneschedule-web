"use client";

import { Users } from "lucide-react";
import { useRouter } from "next/navigation";

import { Row } from "@/src/components/ui/layout/flex";
import { useMyGroup } from "@/src/hooks/querys/useGroup";
import { MyGroupResponse } from "@/src/types/group";
import QuickLink from "./QuickLink";

const MAX_AVATARS = 4;

export default function GroupQuickLink({
  groupCode,
  initialGroup,
}: {
  groupCode?: string;
  initialGroup?: MyGroupResponse;
}) {
  const router = useRouter();
  const { data: group } = useMyGroup(!!groupCode, initialGroup);
  // react-query의 하이드레이션 타이밍과 무관하게, 서버가 내려준 값과
  // 첫 클라이언트 렌더가 항상 같은 값을 그리도록 prop을 우선 사용한다.
  const displayGroup = group ?? initialGroup;

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
                  className="ring-surface flex h-5 w-5 items-center justify-center rounded-full bg-accent/20 text-[9px] font-bold text-accent ring-2"
                >
                  {m.nickname[0]}
                </span>
              ))}
            </Row>
            <span className="typo-caption-2 text-muted">
              {displayGroup.groupName}
            </span>
          </Row>
        ) : (
          "그룹을 만들거나 참여해보세요"
        )
      }
    />
  );
}
