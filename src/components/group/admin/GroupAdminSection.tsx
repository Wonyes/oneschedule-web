"use client";

import { Settings, UserPlus } from "lucide-react";
import { useState } from "react";

import BaseCard from "../../ui/card/BaseCard";
import SegmentedTabs from "../../ui/layout/SegmentedTabs";
import GroupJoinRequestBody from "./GroupJoinRequestBody";
import GroupSettingBody from "./GroupSettingBody";
import SectionBody from "../dashboard/SectionBody";
import { GROUP_SECTION_HEIGHT } from "../dashboard/sectionHeight";
import { useJoinRequests } from "@/src/hooks/querys/useGroup";
import { MyGroupResponse, roleOf } from "@/src/types/group";
import SectionHeading from "../../ui/layout/SectionHeading";

type AdminTab = "request" | "setting";

export default function GroupAdminSection({
  group,
}: {
  group: MyGroupResponse;
}) {
  const { owner, manager } = roleOf(group.groupRole);
  const canReviewRequests = manager && group.visibility === "PUBLIC_APPROVAL";

  const [tab, setTab] = useState<AdminTab>(
    canReviewRequests ? "request" : "setting",
  );

  const { data: requestPages } = useJoinRequests(
    group.groupNo,
    canReviewRequests,
  );
  const pendingCount = requestPages?.pages[0]?.totalElements ?? 0;

  if (!canReviewRequests && !owner) return null;

  const tabs = [
    ...(canReviewRequests
      ? [
          {
            key: "request" as const,
            label: "가입 신청",
            icon: <UserPlus size={12} />,
            badge: pendingCount,
          },
        ]
      : []),
    ...(owner
      ? [
          {
            key: "setting" as const,
            label: "그룹 설정",
            icon: <Settings size={12} />,
          },
        ]
      : []),
  ];

  const showTabs = tabs.length > 1;
  const active = showTabs ? tab : tabs[0].key;

  return (
    <BaseCard
      id="group-manage"
      className={`relative z-30 flex w-full flex-col p-5 ${GROUP_SECTION_HEIGHT}`}
      childClass="flex min-h-0 flex-1 flex-col"
    >
      <SectionHeading
        className="mb-4"
        eyebrow="MANAGE"
        title={active === "request" ? "가입 신청" : "그룹 설정"}
        meta={
          active === "request" && pendingCount > 0
            ? `${pendingCount}건 대기`
            : undefined
        }
      />

      {showTabs && (
        <div className="mb-4 shrink-0">
          <SegmentedTabs
            tabs={tabs}
            value={tab}
            onChange={setTab}
            label="그룹 관리"
          />
        </div>
      )}

      <SectionBody animate={false}>
        {active === "request" ? (
          <GroupJoinRequestBody group={group} />
        ) : (
          <GroupSettingBody group={group} />
        )}
      </SectionBody>
    </BaseCard>
  );
}
