"use client";

import { Settings, UserPlus } from "lucide-react";
import { useState } from "react";

import BaseCard from "../ui/card/BaseCard";
import { Column } from "../ui/layout/flex";
import SegmentedTabs from "../ui/layout/SegmentedTabs";
import GroupJoinRequestBody from "./GroupJoinRequestBody";
import GroupSettingBody from "./GroupSettingBody";
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

  if (!canReviewRequests && !canEditSetting) return null;

  const tabs = [
    ...(canReviewRequests
      ? [
          {
            key: "request" as const,
            label: "가입 신청",
            icon: <UserPlus size={12} />,
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
    <BaseCard className="relative z-30 w-full p-5" glow>
      <Column className="mb-4 gap-1">
        <span className="eyebrow">MANAGE</span>
        <h2 className="typo-sub-t-1 text-foreground">
          {active === "request" ? "가입 신청" : "그룹 설정"}
        </h2>
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
