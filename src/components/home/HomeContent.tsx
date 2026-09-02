"use client";

import { CalendarDays } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo } from "react";

import { MyInfoResponse } from "@/src/hooks/querys/useMembers";
import GroupQuickLink from "./GroupQuickLink";
import HolidayBanner from "./HolidayBanner";
import HomeHero from "./HomeHero";
import QuickLink from "./QuickLink";
import UpcomingSchedules from "./UpcomingSchedules";

export default function HomeContent({ user }: { user: MyInfoResponse }) {
  const router = useRouter();
  const today = useMemo(() => new Date(), []);

  return (
    <div className="scroll-stable flex w-full flex-col gap-4 overflow-y-auto">
      <HomeHero user={user} today={today} />

      <HolidayBanner today={today} />

      <UpcomingSchedules today={today} />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <QuickLink
          icon={<CalendarDays size={18} strokeWidth={1.5} />}
          title="캘린더"
          description="내 일정과 그룹 일정을 확인하세요"
          onClick={() => router.push("/schedule")}
        />

        <GroupQuickLink groupCode={user.groupCode} />
      </div>
    </div>
  );
}
