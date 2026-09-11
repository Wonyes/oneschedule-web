"use client";

import { CalendarCheck, CalendarRange, Users } from "lucide-react";
import { useMemo } from "react";
import { startOfDay, endOfDay } from "date-fns";

import BaseCard from "@/src/components/ui/card/BaseCard";
import Skeleton from "@/src/components/ui/Skeleton";
import IconBox from "@/src/components/ui/IconBox";
import { Column, Row } from "@/src/components/ui/layout/flex";
import { useSchedules } from "@/src/hooks/querys/useSchedule";
import { useActiveGroup } from "@/src/hooks/querys/useGroup";
import { getWeekDates, toScheduleEvent } from "@/src/utils/schedule";
import { MyGroupResponse } from "@/src/types/group";

function StatTile({
  icon,
  title,
  value,
  loading,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
  loading?: boolean;
}) {
  return (
    <BaseCard className="flex-1 px-4 py-3.5">
      <Row className="items-center gap-3">
        <IconBox size="md">{icon}</IconBox>
        <Column className="gap-0.5">
          <span className="typo-caption-3 text-place-h">{title}</span>

          {loading ? (
            <Skeleton className="my-0.5 h-4 w-10 rounded" />
          ) : (
            <span className="typo-sub-t-1 text-foreground tabular-nums">
              {value}
            </span>
          )}
        </Column>
      </Row>
    </BaseCard>
  );
}

export default function HomeStats({
  initialGroups,
  activeGroup,
}: {
  initialGroups?: MyGroupResponse[];
  activeGroup?: MyGroupResponse;
}) {
  const { data: schedules, isLoading: schedulesLoading } =
    useSchedules("PERSONAL");
  const { group, isLoading: groupLoading } = useActiveGroup(
    true,
    initialGroups,
  );
  const displayGroup = group ?? activeGroup;

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
        loading={schedulesLoading}
      />
      <StatTile
        icon={<CalendarRange size={17} strokeWidth={1.75} />}
        title="이번 주 일정"
        value={`${weekCount}개`}
        loading={schedulesLoading}
      />
      <StatTile
        icon={<Users size={17} strokeWidth={1.75} />}
        title="그룹 멤버"
        value={displayGroup ? `${displayGroup.members.length}명` : "-"}
        loading={groupLoading && !activeGroup}
      />
    </Row>
  );
}
