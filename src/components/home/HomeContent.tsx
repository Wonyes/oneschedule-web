"use client";

import { useMemo } from "react";

import { MyInfoResponse } from "@/src/hooks/querys/useMembers";
import { MyGroupResponse } from "@/src/types/group";
import GroupQuickLink from "./GroupQuickLink";
import HorizonFooter from "@/src/components/common/HorizonFooter";
import HomeHero from "./HomeHero";
import MiniCalendar from "./MiniCalendar";
import OnboardingChecklist from "./OnboardingChecklist";
import RecentNotifications from "./RecentNotifications";
import UpcomingSchedules from "./UpcomingSchedules";

export default function HomeContent({
  user,
  initialGroups,
  activeGroup,
}: {
  user: MyInfoResponse;
  initialGroups?: MyGroupResponse[];
  activeGroup?: MyGroupResponse;
}) {
  const today = useMemo(() => new Date(), []);

  return (
    <div className="relative flex min-h-full w-full flex-col gap-3 sm:gap-4 lg:gap-6">
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-24 left-1/4 h-72 w-72 rounded-full bg-accent/10" />
        <div className="absolute top-1/3 right-0 h-80 w-80 rounded-full bg-accent/[0.06]" />
      </div>

      <HomeHero
        user={user}
        today={today}
        initialGroups={initialGroups}
        activeGroup={activeGroup}
      />

      <OnboardingChecklist user={user} today={today} />

      <div className="flex flex-col gap-3 sm:gap-4 lg:flex-row lg:items-start lg:gap-6">
        <div className="flex min-w-0 flex-1 flex-col gap-3 sm:gap-4 lg:gap-6">
          <UpcomingSchedules today={today} />

          <RecentNotifications />
        </div>

        <div className="flex flex-col gap-3 sm:gap-4 lg:w-72 lg:shrink-0 lg:gap-6">
          <MiniCalendar today={today} />

          <GroupQuickLink
            initialGroups={initialGroups}
            activeGroup={activeGroup}
          />
        </div>
      </div>

      {/* 내용이 짧으면 바닥에 붙고, 길면 내용 끝에 따라온다 */}
      <div className="mt-auto">
        <HorizonFooter />
      </div>
    </div>
  );
}
