"use client";

import { Activity, CalendarDays, Users } from "lucide-react";
import { useState } from "react";

import { GroupHero } from "./GroupHero";
import { Column } from "../ui/layout/flex";
import { MyGroupResponse } from "@/src/types/group";

import GroupMemberSection from "./GroupMemberSection";
import GroupScheduleSection from "./GroupScheduleSection";
import GroupActivitySection from "./GroupActivitySection";
import GroupAdminSection from "./GroupAdminSection";
import SegmentedTabs from "../ui/layout/SegmentedTabs";
import BaseCard from "../ui/card/BaseCard";
import { useGroupSchedules } from "./useGroupSchedules";

type TabKey = "schedule" | "member" | "activity";

export default function GroupDashboard({ group }: { group: MyGroupResponse }) {
  const [tab, setTab] = useState<TabKey>("schedule");
  const { today } = useGroupSchedules(group.groupNo);

  const isAdmin = group.groupRole === "SUPER" || group.groupRole === "SUB";

  const mobileTabs = (
    <SegmentedTabs
      label="그룹 상세"
      value={tab}
      onChange={setTab}
      tabs={[
        {
          key: "schedule",
          label: "일정",
          icon: <CalendarDays size={12} />,
          badge: today.length,
        },
        {
          key: "member",
          label: "멤버",
          icon: <Users size={12} />,
          badge: group.members.length,
        },
        { key: "activity", label: "활동", icon: <Activity size={12} /> },
      ]}
    />
  );

  return (
    <Column className="w-full gap-5 pb-1">
      <GroupHero group={group} />

      <Column className="w-full gap-5 lg:hidden">
        <BaseCard className="w-full p-2">{mobileTabs}</BaseCard>

        {tab === "schedule" && <GroupScheduleSection group={group} animate />}
        {tab === "member" && (
          <GroupMemberSection group={group} isAdmin={isAdmin} animate />
        )}
        {tab === "activity" && <GroupActivitySection group={group} animate />}

        <GroupAdminSection group={group} isAdmin={isAdmin} />
      </Column>

      <Column className="hidden w-full gap-5 lg:flex">
        <div className="grid w-full items-start gap-5 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
          <Column className="min-w-0 gap-5">
            <GroupScheduleSection group={group} />
            <GroupActivitySection group={group} />
          </Column>
          <GroupMemberSection group={group} isAdmin={isAdmin} withAdminTabs />
        </div>
      </Column>
    </Column>
  );
}
