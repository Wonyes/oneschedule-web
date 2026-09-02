"use client";

import { Users } from "lucide-react";
import { useRouter } from "next/navigation";

import { Row } from "@/src/components/ui/layout/flex";
import { useMyGroup } from "@/src/hooks/querys/useGroup";
import QuickLink from "./QuickLink";

const MAX_AVATARS = 4;

export default function GroupQuickLink({ groupCode }: { groupCode?: string }) {
  const router = useRouter();
  const { data: group } = useMyGroup(!!groupCode);

  return (
    <QuickLink
      icon={<Users size={18} strokeWidth={1.5} />}
      title="그룹"
      onClick={() => router.push("/group")}
      description={
        group ? (
          <Row className="items-center gap-2">
            <Row className="-space-x-1.5">
              {group.members.slice(0, MAX_AVATARS).map((m) => (
                <span
                  key={m.memberNo}
                  className="ring-surface flex h-5 w-5 items-center justify-center rounded-full bg-accent/20 text-[9px] font-bold text-accent ring-2"
                >
                  {m.nickname[0]}
                </span>
              ))}
            </Row>
            <span className="typo-caption-2 text-muted">{group.groupName}</span>
          </Row>
        ) : (
          "그룹을 만들거나 참여해보세요"
        )
      }
    />
  );
}
