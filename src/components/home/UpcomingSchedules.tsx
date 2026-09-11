"use client";

import { startOfDay } from "date-fns";
import { Plus } from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";

import BaseCard from "@/src/components/ui/card/BaseCard";
import { Column, Between } from "@/src/components/ui/layout/flex";
import ScheduleCard from "@/src/components/schedule/components/ScheduleCard";
import { useSchedules } from "@/src/hooks/querys/useSchedule";
import { useActiveGroup } from "@/src/hooks/querys/useGroup";
import Skeleton from "@/src/components/ui/Skeleton";
import { useSheetStore } from "@/src/hooks/stores/useSheetStore";
import { toScheduleEvent } from "@/src/utils/schedule";

const MAX_ITEMS = 3;

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

  const upcomingEvents = useMemo(() => {
    const start = startOfDay(today).getTime();
    const combined = [...(personalSchedules ?? []), ...(groupSchedules ?? [])];

    return combined
      .map(toScheduleEvent)
      .filter((e) => new Date(e.startDate).getTime() >= start)
      .sort(
        (a, b) =>
          new Date(a.startDate).getTime() - new Date(b.startDate).getTime(),
      )
      .slice(0, MAX_ITEMS);
  }, [personalSchedules, groupSchedules, today]);

  return (
    <BaseCard className="p-5">
      <Between className="mb-3">
        <Column className="gap-1">
          <span className="eyebrow">SCHEDULE</span>
          <span className="typo-sub-t-1 text-foreground">다가오는 일정</span>
        </Column>

        <Link
          href="/schedule"
          prefetch
          className="typo-caption-2 text-accent hover:underline"
        >
          전체 보기
        </Link>
      </Between>

      {loading ? (
        <Column className="w-full gap-2">
          <Skeleton className="h-[58px] w-full rounded-xl" />
          <Skeleton className="h-[58px] w-full rounded-xl" />
          <Skeleton className="h-[58px] w-full rounded-xl" />
        </Column>
      ) : upcomingEvents.length === 0 ? (
        <Column className="items-center gap-3 py-6">
          <p className="typo-caption-2 text-muted text-center">
            아직 등록된 일정이 없어요.
          </p>

          <button
            type="button"
            onClick={() => openSheet({ date: today, type: "PERSONAL" })}
            className="btn-spring neu-btn text-secondary hover:text-foreground flex h-9 items-center gap-1.5 rounded-xl px-4 typo-caption-2 font-medium"
          >
            <Plus size={14} strokeWidth={2} />첫 일정 등록하기
          </button>
        </Column>
      ) : (
        <Column className="gap-2">
          {upcomingEvents.map((event) => (
            <ScheduleCard
              key={event.id}
              event={event}
              date={new Date(event.startDate)}
              variant="agenda"
              onClick={() => openSheet({ event })}
            />
          ))}
        </Column>
      )}
    </BaseCard>
  );
}
