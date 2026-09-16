"use client";

import { Settings, UserPlus } from "lucide-react";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

import BaseCard from "../ui/card/BaseCard";
import SegmentedTabs from "../ui/layout/SegmentedTabs";
import GroupJoinRequestBody from "./GroupJoinRequestBody";
import GroupSettingBody from "./GroupSettingBody";
import SectionBody from "./SectionBody";
import { GROUP_SECTION_HEIGHT } from "./sectionHeight";
import { useJoinRequests } from "@/src/hooks/querys/useGroup";
import { MyGroupResponse } from "@/src/types/group";
import SectionHeading from "../ui/layout/SectionHeading";

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

  const requested = useSearchParams().get("tab") === "requests";
  const [tab, setTab] = useState<AdminTab>(
    canReviewRequests ? "request" : "setting",
  );

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (requested && canReviewRequests) setTab("request");
  }, [requested, canReviewRequests]);

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
