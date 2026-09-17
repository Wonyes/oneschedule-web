"use client";

import { CalendarCheck, CalendarRange, Group } from "lucide-react";
import { useMemo } from "react";
import { startOfDay, endOfDay } from "date-fns";

import Skeleton from "@/src/components/ui/Skeleton";
import { Row } from "@/src/components/ui/layout/flex";
import { useSchedules } from "@/src/hooks/querys/useSchedule";
import { useActiveGroup } from "@/src/hooks/querys/useGroup";
import {
  eventsInRange,
  getWeekDates,
  toScheduleEvent,
} from "@/src/utils/schedule";
import { MyGroupResponse } from "@/src/types/group";

function StatChip({
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
    <Row className="neu-pressed h-9 items-center gap-2 rounded-xl px-3">
      <span className="text-accent">{icon}</span>
      <span className="typo-caption-3 text-place-h">{title}</span>
      {loading ? (
        <Skeleton className="h-3.5 w-7 rounded" />
      ) : (
        <span className="typo-caption-2 font-semibold tabular-nums text-foreground">
          {value}
        </span>
      )}
    </Row>
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
  const {
    group,
    groups,
    isLoading: groupLoading,
  } = useActiveGroup(true, initialGroups);
  const displayGroup = group ?? activeGroup;

  const { todayCount, weekCount } = useMemo(() => {
    const now = new Date();
    const weekDates = getWeekDates(now);
    const events = (schedules ?? []).map(toScheduleEvent);

    return {
      todayCount: eventsInRange(events, startOfDay(now), endOfDay(now)).length,
      weekCount: eventsInRange(
        events,
        startOfDay(weekDates[0]),
        endOfDay(weekDates[weekDates.length - 1]),
      ).length,
    };
  }, [schedules]);

  return (
    <Row className="flex-wrap gap-2">
      <StatChip
        icon={<CalendarCheck size={14} strokeWidth={1.75} />}
        title="오늘 일정"
        value={`${todayCount}개`}
        loading={schedulesLoading}
      />
      <StatChip
        icon={<CalendarRange size={14} strokeWidth={1.75} />}
        title="이번 주 일정"
        value={`${weekCount}개`}
        loading={schedulesLoading}
      />

      <StatChip
        icon={<Group size={14} strokeWidth={1.75} />}
        title="가입한 그룹"
        value={displayGroup ? `${groups?.length || 0}개` : "-"}
        loading={groupLoading}
      />
    </Row>
  );
}
