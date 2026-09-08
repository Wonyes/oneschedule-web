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
import BaseCard from "../ui/card/BaseCard";

type TabKey = "member" | "schedule" | "activity";

const TABS = [
  { key: "member" as const, label: "멤버", icon: <Users size={12} /> },
  { key: "schedule" as const, label: "일정", icon: <CalendarDays size={12} /> },
  { key: "activity" as const, label: "활동", icon: <Activity size={12} /> },
];

export default function GroupDashboard({ group }: { group: MyGroupResponse }) {
  const [tab, setTab] = useState<TabKey>("member");

  const isAdmin = group?.groupRole === "SUPER" || group?.groupRole === "SUB";

  const memberSection = (
    <GroupMemberSection
      isAdmin={isAdmin}
      members={group.members}
      groupNo={group.groupNo}
    />
  );

  return (
    <Column className="w-full gap-5 pb-1">
      <GroupHero group={group} />

      <GroupSummary group={group} />

      <GroupAdminSection group={group} isAdmin={isAdmin} />

      <Column className="w-full gap-5 lg:hidden">
        <BaseCard className="w-full p-2">
          <SegmentedTabs
            tabs={TABS}
            value={tab}
            onChange={setTab}
            label="그룹 상세"
          />
        </BaseCard>

        {tab === "member" && memberSection}
        {tab === "schedule" && <GroupScheduleSection group={group} />}
        {tab === "activity" && <GroupActivitySection group={group} />}
      </Column>

      <Column className="hidden w-full gap-5 lg:flex">
        <Row className="w-full items-stretch gap-5">
          {memberSection}
          <GroupScheduleSection group={group} />
        </Row>

        <GroupActivitySection group={group} />
      </Column>
    </Column>
  );
}
