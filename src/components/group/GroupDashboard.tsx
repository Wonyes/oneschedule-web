"use client";

import { Activity, CalendarDays, Users } from "lucide-react";
import { useState } from "react";

import { GroupHero } from "./GroupHero";
import { Column, Row } from "../ui/layout/flex";
import { MyGroupResponse } from "@/src/types/group";

import GroupSummary from "./GroupSummary";
import GroupMemberSection from "./GroupMemberSection";
import GroupScheduleSection from "./GroupScheduleSection";
import GroupActivitySection from "./GroupActivitySection";
import GroupAdminSection from "./GroupAdminSection";
import SegmentedTabs from "../ui/layout/SegmentedTabs";

type TabKey = "member" | "schedule" | "activity";

export default function GroupDashboard({ group }: { group: MyGroupResponse }) {
  const [tab, setTab] = useState<TabKey>("member");

  const isAdmin = group?.groupRole === "SUPER" || group?.groupRole === "SUB";

  const tabs = [
    {
      key: "member" as const,
      label: "멤버",
      icon: <Users size={12} />,
      badge: group.members.length,
    },
    {
      key: "schedule" as const,
      label: "일정",
      icon: <CalendarDays size={12} />,
    },
    {
      key: "activity" as const,
      label: "활동",
      icon: <Activity size={12} />,
    },
  ];

  const mobileTabs = (
    <SegmentedTabs
      tabs={tabs}
      value={tab}
      onChange={setTab}
      label="그룹 상세"
    />
  );

  return (
    <Column className="w-full gap-5 pb-1">
      <GroupHero group={group} />

      <GroupSummary group={group} />

      <GroupAdminSection group={group} isAdmin={isAdmin} />

      <Column className="w-full gap-5 lg:hidden">
        {tab === "member" && (
          <GroupMemberSection
            isAdmin={isAdmin}
            members={group.members}
            groupNo={group.groupNo}
            toolbar={mobileTabs}
          />
        )}
        {tab === "schedule" && (
          <GroupScheduleSection group={group} toolbar={mobileTabs} />
        )}
        {tab === "activity" && (
          <GroupActivitySection group={group} toolbar={mobileTabs} />
        )}
      </Column>

      <Column className="hidden w-full gap-5 lg:flex">
        <Row className="w-full items-stretch gap-5">
          <GroupMemberSection
            isAdmin={isAdmin}
            members={group.members}
            groupNo={group.groupNo}
          />
          <GroupScheduleSection group={group} />
        </Row>

        <GroupActivitySection group={group} />
      </Column>
    </Column>
  );
}
