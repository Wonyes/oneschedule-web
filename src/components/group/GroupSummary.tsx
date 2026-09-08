"use client";

import React, { useMemo } from "react";
import { startOfDay, endOfDay, addDays } from "date-fns";
import BaseCard from "../ui/card/BaseCard";
import { Row } from "../ui/layout/flex";
import { MyGroupResponse } from "@/src/types/group";
import { CalendarDays, Clock, Crown, Users } from "lucide-react";
import { useSchedules } from "@/src/hooks/querys/useSchedule";
import { toScheduleEvent } from "@/src/utils/schedule";
import IconBox from "../ui/IconBox";

const UPCOMING_RANGE_DAYS = 7;

export default function GroupSummary({ group }: { group: MyGroupResponse }) {
  const { data: schedules } = useSchedules("GROUP", true, group.groupNo);

  const { todayCount, upcomingCount } = useMemo(() => {
    const now = new Date();
    const todayStart = startOfDay(now).getTime();
    const todayEnd = endOfDay(now).getTime();
    const upcomingEnd = endOfDay(
      addDays(now, UPCOMING_RANGE_DAYS - 1),
    ).getTime();

    const events = (schedules ?? []).map(toScheduleEvent);

    return {
      todayCount: events.filter((e) => {
        const s = new Date(e.startDate).getTime();
        return s >= todayStart && s <= todayEnd;
      }).length,
      upcomingCount: events.filter((e) => {
        const s = new Date(e.startDate).getTime();
        return s >= todayStart && s <= upcomingEnd;
      }).length,
    };
  }, [schedules]);

  const adminCount = group.members.filter(
    (member) => member.groupRole === "SUPER" || member.groupRole === "SUB",
  ).length;

  return (
    <div className="grid w-full grid-cols-2 gap-2.5 lg:grid-cols-4 lg:gap-5">
      <Compact
        icon={<Users size={15} strokeWidth={1.5} />}
        title="멤버"
        value={`${group.members.length}명`}
      />
      <Compact
        icon={<Crown size={15} strokeWidth={1.5} />}
        title="관리자"
        value={`${adminCount}명`}
      />
      <Compact
        icon={<CalendarDays size={15} strokeWidth={1.5} />}
        title="오늘 일정"
        value={`${todayCount}개`}
      />
      <Compact
        icon={<Clock size={15} strokeWidth={1.5} />}
        title={`다가오는 ${UPCOMING_RANGE_DAYS}일`}
        value={`${upcomingCount}개`}
      />
    </div>
  );
}

function Compact({
  icon,
  title,
  value,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
}) {
  return (
    <BaseCard className="flex-1 px-3 py-3 lg:px-4">
      {/*
        좁은 화면에서는 아이콘·라벨·값을 한 줄에 넣으면 라벨이 잘린다.
        위아래로 나눠 아이콘을 살리고 라벨도 온전히 보여준다.
      */}
      <div className="flex flex-col gap-1.5 lg:flex-row lg:items-center lg:justify-between lg:gap-2">
        <Row className="min-w-0 gap-2">
          <IconBox
            size="md"
            shape="circle"
            className="typo-caption-3 font-bold"
          >
            {icon}
          </IconBox>
          <span className="typo-caption-2 truncate text-place-h">{title}</span>
        </Row>

        <span className="typo-caption-2 shrink-0 text-right font-bold text-foreground tabular-nums">
          {value}
        </span>
      </div>
    </BaseCard>
  );
}
