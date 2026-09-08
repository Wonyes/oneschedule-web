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

const TABS = [
  { key: "member" as const, label: "멤버", icon: <Users size={12} /> },
  { key: "schedule" as const, label: "일정", icon: <CalendarDays size={12} /> },
  { key: "activity" as const, label: "활동", icon: <Activity size={12} /> },
];

export default function GroupDashboard({ group }: { group: MyGroupResponse }) {
  const [tab, setTab] = useState<TabKey>("member");

  // SUPER/SUB 모두 멤버를 관리할 수 있다. SUPER 본인은 GroupMemberSection의
  // "member.groupRole !== SUPER" 조건으로 건드릴 수 없게 막혀 있다.
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
        <SegmentedTabs
          tabs={TABS}
          value={tab}
          onChange={setTab}
          label="그룹 상세"
        />

        {tab === "member" && memberSection}
        {tab === "schedule" && <GroupScheduleSection group={group} />}
        {tab === "activity" && <GroupActivitySection group={group} />}
      </Column>

      <Column className="hidden w-full gap-5 lg:flex">
        <Row className="w-full gap-5">
          {memberSection}
          <GroupScheduleSection group={group} />
        </Row>

        <GroupActivitySection group={group} />
      </Column>
    </Column>
  );
}
