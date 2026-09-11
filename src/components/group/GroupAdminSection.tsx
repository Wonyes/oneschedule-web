"use client";

import { Settings, UserPlus } from "lucide-react";
import { useState } from "react";

import BaseCard from "../ui/card/BaseCard";
import { Column, Row } from "../ui/layout/flex";
import SegmentedTabs from "../ui/layout/SegmentedTabs";
import GroupJoinRequestBody from "./GroupJoinRequestBody";
import GroupSettingBody from "./GroupSettingBody";
import { useJoinRequests } from "@/src/hooks/querys/useGroup";
import { MyGroupResponse } from "@/src/types/group";

type AdminTab = "request" | "setting";

export default function GroupAdminSection({
  group,
  isAdmin,
}: {
  group: MyGroupResponse;
  isAdmin: boolean;
}) {
  const canReviewRequests = isAdmin && group.visibility === "PUBLIC_APPROVAL";
  const canEditSetting = group.groupRole === "SUPER";

  const [tab, setTab] = useState<AdminTab>(
    canReviewRequests ? "request" : "setting",
  );

  const { data: requestPages } = useJoinRequests(
    group.groupNo,
    canReviewRequests,
  );
  const pendingCount = requestPages?.pages[0]?.totalElements ?? 0;

  if (!canReviewRequests && !canEditSetting) return null;

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
    ...(canEditSetting
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
    <BaseCard className="relative z-30 order-last w-full p-5 lg:order-none" glow>
      <Column className="mb-4 gap-1">
        <span className="eyebrow">MANAGE</span>
        <Row className="items-center gap-2">
          <h2 className="typo-sub-t-1 text-foreground">
            {active === "request" ? "가입 신청" : "그룹 설정"}
          </h2>
          {active === "request" && pendingCount > 0 && (
            <span className="rounded-full bg-accent/12 px-2 py-0.5 typo-caption-3 font-bold tabular-nums text-accent">
              {pendingCount}건 대기
            </span>
          )}
        </Row>
      </Column>

      {showTabs && (
        <div className="mb-4">
          <SegmentedTabs
            tabs={tabs}
            value={tab}
            onChange={setTab}
            label="그룹 관리"
          />
        </div>
      )}

      {active === "request" ? (
        <GroupJoinRequestBody group={group} />
      ) : (
        <GroupSettingBody group={group} />
      )}
    </BaseCard>
  );
}
