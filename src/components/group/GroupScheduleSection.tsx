"use client";

import { useMemo } from "react";
import { startOfDay, endOfDay } from "date-fns";

import BaseCard from "../ui/card/BaseCard";
import { Between, Column, Row } from "../ui/layout/flex";
import { CalendarDays } from "lucide-react";
import { useSchedules } from "@/src/hooks/querys/useSchedule";
import { getTimes, toScheduleEvent } from "@/src/utils/schedule";

export default function GroupScheduleSection() {
  const { data: schedules } = useSchedules("GROUP");

  const todayEvents = useMemo(() => {
    const now = new Date();
    const start = startOfDay(now).getTime();
    const end = endOfDay(now).getTime();

    return (schedules ?? [])
      .map(toScheduleEvent)
      .filter((e) => {
        const s = new Date(e.startDate).getTime();
        return s >= start && s <= end;
      })
      .sort(
        (a, b) =>
          new Date(a.startDate).getTime() - new Date(b.startDate).getTime(),
      );
  }, [schedules]);

  return (
    <BaseCard glow className="flex-1 p-5 h-[420px] lg:h-[520px]">
      <Column className="mb-4 gap-1.5">
        <span className="eyebrow">TODAY</span>
        <Row className="gap-1.5">
          <CalendarDays size={16} strokeWidth={1.5} className="text-muted" />
          <h2 className="typo-sub-t-1 text-foreground">오늘 일정</h2>
        </Row>
      </Column>

      {todayEvents.length === 0 ? (
        <p className="py-10 text-center typo-caption-2 text-muted">
          오늘 등록된 그룹 일정이 없습니다.
        </p>
      ) : (
        <Column className="gap-2.5">
          {todayEvents.map((event) => (
            <ScheduleItem
              key={event.id}
              time={getTimes(event.startDate)}
              title={event.title}
            />
          ))}
        </Column>
      )}
    </BaseCard>
  );
}

function ScheduleItem({ time, title }: { time: string; title: string }) {
  return (
    <Between className="rounded-lg px-3 py-2.5 w-full neu-flat">
      <span className="typo-caption-2 text-place-h tabular-nums shrink-0">
        {time}
      </span>

      <span className="typo-caption-2 font-medium truncate">{title}</span>
    </Between>
  );
}
