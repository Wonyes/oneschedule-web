"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Settings, UserPlus, Users } from "lucide-react";

import BaseCard from "../../ui/card/BaseCard";
import { GROUP_SECTION_HEIGHT } from "../dashboard/sectionHeight";
import SegmentedTabs from "../../ui/layout/SegmentedTabs";
import GroupJoinRequestBody from "../admin/GroupJoinRequestBody";
import GroupMemberList from "./GroupMemberList";
import GroupSettingBody from "../admin/GroupSettingBody";
import SectionBody from "../dashboard/SectionBody";
import { useJoinRequests } from "@/src/hooks/querys/useGroup";
import { MyGroupResponse, roleOf } from "@/src/types/group";
import SectionHeading from "../../ui/layout/SectionHeading";

type TeamTab = "members" | "requests" | "settings";

export default function GroupMemberSection({
  group,
  withAdminTabs = false,
  animate = false,
}: {
  group: MyGroupResponse;
  withAdminTabs?: boolean;
  animate?: boolean;
}) {
  const { owner, manager } = roleOf(group.groupRole);
  const canReview =
    withAdminTabs && manager && group.visibility === "PUBLIC_APPROVAL";
  const canEdit = withAdminTabs && owner;
  const requested = useSearchParams().get("tab") === "requests";

  const [tab, setTab] = useState<TeamTab>(
    requested && canReview ? "requests" : "members",
  );

  const { data: requestPages } = useJoinRequests(group.groupNo, canReview);
  const pendingCount = requestPages?.pages[0]?.totalElements ?? 0;

  const tabs = [
    { key: "members" as const, label: "멤버", icon: <Users size={12} /> },
    ...(canReview
      ? [
          {
            key: "requests" as const,
            label: "신청",
            icon: <UserPlus size={12} />,
            badge: pendingCount,
          },
        ]
      : []),
    ...(canEdit
      ? [
          {
            key: "settings" as const,
            label: "설정",
            icon: <Settings size={12} />,
          },
        ]
      : []),
  ];

  const active = tabs.some((t) => t.key === tab) ? tab : "members";

  return (
    <BaseCard
      id="group-team"
      className={`flex flex-col p-5 ${GROUP_SECTION_HEIGHT}`}
      childClass="flex min-h-0 flex-1 flex-col"
    >
      <SectionHeading
        className="mb-4"
        eyebrow="TEAM"
        title="멤버"
        meta={group.members.length}
      />

      {tabs.length > 1 && (
        <div className="mb-4">
          <SegmentedTabs
            tabs={tabs}
            value={active}
            onChange={setTab}
            label="팀 관리"
          />
        </div>
      )}

      <SectionBody animate={animate}>
        {active === "members" && (
          <GroupMemberList
            members={group.members}
            manager={manager}
            groupNo={group.groupNo}
          />
        )}
        {active === "requests" && <GroupJoinRequestBody group={group} />}
        {active === "settings" && <GroupSettingBody group={group} />}
      </SectionBody>
    </BaseCard>
  );
}
