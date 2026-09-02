"use client";

import React, { useMemo } from "react";
import { startOfDay, endOfDay, addDays } from "date-fns";
import BaseCard from "../ui/card/BaseCard";
import { Column, Row } from "../ui/layout/flex";
import { MyGroupResponse } from "@/src/types/group";
import { CalendarDays, Clock, Users } from "lucide-react";
import { useSchedules } from "@/src/hooks/querys/useSchedule";
import { toScheduleEvent } from "@/src/utils/schedule";

// "다가오는 일정"은 오늘부터 7일 이내(오늘 포함) 시작하는 일정 수를 센다.
const UPCOMING_RANGE_DAYS = 7;

export default function GroupSummary({ group }: { group: MyGroupResponse }) {
  const { data: schedules } = useSchedules("GROUP");

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

  return (
    <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-[1.3fr_1fr] sm:gap-5">
      <BaseCard className="h-full p-4">
        <Row className="h-full items-center justify-between">
          <Column className="gap-1">
            <span className="typo-caption-2 text-place-h">멤버</span>
            <Row className="items-baseline gap-1">
              <span className="typo-sub-t-1 text-foreground tabular-nums">
                {group.members.length}
              </span>
              <span className="typo-caption-3 text-muted">명</span>
            </Row>
          </Column>

          <Row className="h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-surface-hover text-secondary">
            <Users size={16} strokeWidth={1.5} />
          </Row>
        </Row>
      </BaseCard>

      <Column className="gap-2.5 sm:gap-3">
        <Compact
          icon={<CalendarDays size={15} strokeWidth={1.5} />}
          title="오늘 일정"
          value={`${todayCount}개`}
        />
        <Compact
          icon={<Clock size={15} strokeWidth={1.5} />}
          title={`다가오는 일정 (${UPCOMING_RANGE_DAYS}일)`}
          value={`${upcomingCount}개`}
        />
      </Column>
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
    <BaseCard className="flex-1 px-4 py-3">
      <Row className="items-center justify-between">
        <Row className="gap-2">
          <Row className="h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-surface-hover text-secondary">
            {icon}
          </Row>
          <span className="typo-caption-2 text-place-h">{title}</span>
        </Row>

        <span className="typo-caption-2 font-bold text-foreground tabular-nums">
          {value}
        </span>
      </Row>
    </BaseCard>
  );
}
