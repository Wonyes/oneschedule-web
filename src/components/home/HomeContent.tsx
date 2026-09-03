"use client";

import { CalendarDays } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo } from "react";

import { MyInfoResponse } from "@/src/hooks/querys/useMembers";
import { MyGroupResponse } from "@/src/types/group";
import GroupQuickLink from "./GroupQuickLink";
import HolidayBanner from "./HolidayBanner";
import HomeHero from "./HomeHero";
import HomeStats from "./HomeStats";
import OnboardingChecklist from "./OnboardingChecklist";
import QuickLink from "./QuickLink";
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
  const router = useRouter();
  const today = useMemo(() => new Date(), []);

  return (
    <div className="relative flex w-full flex-col gap-4 lg:gap-6">
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-24 left-1/4 h-72 w-72 rounded-full bg-accent/10" />
        <div className="absolute top-1/3 right-0 h-80 w-80 rounded-full bg-accent/[0.06]" />
      </div>

      <HomeHero user={user} today={today} />

      <OnboardingChecklist user={user} today={today} />

      <HomeStats initialGroups={initialGroups} activeGroup={activeGroup} />

      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:gap-6">
        <div className="flex min-w-0 flex-1 flex-col gap-4 lg:gap-6">
          <HolidayBanner today={today} />

          <UpcomingSchedules today={today} />
        </div>

        <div className="flex flex-col gap-4 lg:w-72 lg:shrink-0 lg:gap-6">
          <QuickLink
            icon={<CalendarDays size={18} strokeWidth={1.5} />}
            title="캘린더"
            description="내 일정과 그룹 일정을 확인하세요"
            onClick={() => router.push("/schedule")}
          />

          <GroupQuickLink
            initialGroups={initialGroups}
            activeGroup={activeGroup}
          />
        </div>
      </div>
    </div>
  );
}
