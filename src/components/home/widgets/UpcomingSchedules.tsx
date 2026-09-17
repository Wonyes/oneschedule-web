"use client";

import { addDays, startOfDay } from "date-fns";
import { Plus } from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";

import BaseCard from "@/src/components/ui/card/BaseCard";
import { Column, Between } from "@/src/components/ui/layout/flex";
import { DayGroup } from "@/src/components/schedule/parts/DayTimeline";
import { useSchedules } from "@/src/hooks/querys/useSchedule";
import { useActiveGroup } from "@/src/hooks/querys/useGroup";
import { DayGroupSkeleton } from "@/src/components/ui/SkeletonParts";
import { useSheetStore } from "@/src/hooks/stores/useSheetStore";
import { ScheduleEvent } from "@/src/types/schedule";
import { byStart, toScheduleEvent } from "@/src/utils/schedule";
import SectionHeading from "../../ui/layout/SectionHeading";

/** 오늘·내일은 항상, 그 뒤로는 일정이 있는 날만 — 합쳐서 최대 며칠 */
const MAX_DAYS = 4;

export default function UpcomingSchedules({ today }: { today: Date }) {
  const { openSheet } = useSheetStore();

  const { group } = useActiveGroup();

  const { data: personalSchedules, isLoading: personalLoading } = useSchedules(
    "PERSONAL",
    true,
  );
  const { data: groupSchedules, isLoading: groupLoading } = useSchedules(
    "GROUP",
    true,
    group?.groupNo,
  );

  const loading = personalLoading || groupLoading;

  // 오늘·내일은 비어 있어도 보여주고, 그 뒤는 일정이 있는 날만
  const days = useMemo(() => {
    const todayStart = startOfDay(today);
    const start = todayStart.getTime();
    const combined = [...(personalSchedules ?? []), ...(groupSchedules ?? [])];

    const byDay = new Map<number, { date: Date; events: ScheduleEvent[] }>();
    for (const date of [todayStart, addDays(todayStart, 1)]) {
      byDay.set(date.getTime(), { date, events: [] });
    }
    combined
      .map(toScheduleEvent)
      .filter((e) => new Date(e.startDate).getTime() >= start)
      .sort(byStart)
      .forEach((e) => {
        const date = startOfDay(new Date(e.startDate));
        const key = date.getTime();
        if (!byDay.has(key)) byDay.set(key, { date, events: [] });
        byDay.get(key)!.events.push(e);
      });

    return [...byDay.values()]
      .sort((a, b) => a.date.getTime() - b.date.getTime())
      .slice(0, MAX_DAYS);
  }, [personalSchedules, groupSchedules, today]);

  return (
    <BaseCard className="flex-1 p-4 sm:p-5">
      <Between className="mb-4">
        <SectionHeading eyebrow="SCHEDULE" title="다가오는 일정" />

        <Link
          href="/schedule"
          prefetch
          className="typo-caption-2 -m-2 p-2 text-accent hover:underline"
        >
          전체 보기
        </Link>
      </Between>

      {loading ? (
        <Column className="w-full gap-5">
          <DayGroupSkeleton items={2} />
          <DayGroupSkeleton items={1} />
        </Column>
      ) : (
        <Column className="gap-5">
          {days.map(({ date, events }) => (
            <DayGroup
              key={date.getTime()}
              date={date}
              events={events}
              emptyText={
                date.getTime() === startOfDay(today).getTime()
                  ? "오늘은 비어 있어요."
                  : "비어 있어요."
              }
              onEventClick={(event) => openSheet({ event })}
            />
          ))}

          {days.every((d) => d.events.length === 0) && (
            <button
              type="button"
              onClick={() => openSheet({ date: today, type: "PERSONAL" })}
              className="btn-spring neu-btn text-secondary hover:text-foreground mx-auto flex h-9 items-center gap-1.5 rounded-xl px-4 typo-caption-2 font-medium"
            >
              <Plus size={14} strokeWidth={2} />첫 일정 등록하기
            </button>
          )}
        </Column>
      )}
    </BaseCard>
  );
}
