"use client";

import { CalendarCheck, CalendarRange, Users } from "lucide-react";
import { useMemo } from "react";
import { startOfDay, endOfDay } from "date-fns";

import BaseCard from "@/src/components/ui/card/BaseCard";
import { Column, Row } from "@/src/components/ui/layout/flex";
import { useSchedules } from "@/src/hooks/querys/useSchedule";
import { useMyGroup } from "@/src/hooks/querys/useGroup";
import { getWeekDates, toScheduleEvent } from "@/src/utils/schedule";

function StatTile({
  icon,
  title,
  value,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
}) {
  return (
    <BaseCard className="flex-1 px-4 py-3.5">
      <Row className="items-center gap-3">
        <Row className="h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent">
          {icon}
        </Row>
        <Column className="gap-0.5">
          <span className="typo-caption-3 text-place-h">{title}</span>
          <span className="typo-sub-t-1 text-foreground tabular-nums">
            {value}
          </span>
        </Column>
      </Row>
    </BaseCard>
  );
}

export default function HomeStats({ groupCode }: { groupCode?: string }) {
  const { data: schedules } = useSchedules("PERSONAL");
  const { data: group } = useMyGroup(!!groupCode);

  const { todayCount, weekCount } = useMemo(() => {
    const now = new Date();
    const todayStart = startOfDay(now);
    const todayEnd = endOfDay(now);

    const weekDates = getWeekDates(now);
    const weekStart = startOfDay(weekDates[0]);
    const weekEnd = endOfDay(weekDates[weekDates.length - 1]);

    const events = (schedules ?? []).map(toScheduleEvent);

    const inRange = (start: Date, end: Date) =>
      events.filter((e) => {
        const s = new Date(e.startDate);
        return s >= start && s <= end;
      }).length;

    return {
      todayCount: inRange(todayStart, todayEnd),
      weekCount: inRange(weekStart, weekEnd),
    };
  }, [schedules]);

  return (
    <Row className="flex-col gap-3 sm:flex-row sm:gap-4">
      <StatTile
        icon={<CalendarCheck size={17} strokeWidth={1.75} />}
        title="오늘 일정"
        value={`${todayCount}개`}
      />
      <StatTile
        icon={<CalendarRange size={17} strokeWidth={1.75} />}
        title="이번 주 일정"
        value={`${weekCount}개`}
      />
      <StatTile
        icon={<Users size={17} strokeWidth={1.75} />}
        title="그룹 멤버"
        value={group ? `${group.members.length}명` : "-"}
      />
    </Row>
  );
}
