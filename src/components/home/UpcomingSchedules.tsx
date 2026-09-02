"use client";

import { startOfDay } from "date-fns";
import { useRouter } from "next/navigation";
import { useMemo } from "react";

import BaseCard from "@/src/components/ui/card/BaseCard";
import { Column, Between } from "@/src/components/ui/layout/flex";
import ScheduleCard from "@/src/components/schedule/components/ScheduleCard";
import { useSchedules } from "@/src/hooks/querys/useSchedule";
import { useSheetStore } from "@/src/hooks/stores/useSheetStore";
import { toScheduleEvent } from "@/src/utils/schedule";

const MAX_ITEMS = 3;

export default function UpcomingSchedules({ today }: { today: Date }) {
  const router = useRouter();
  const { openSheet } = useSheetStore();
  const { data: personalSchedules } = useSchedules("PERSONAL", true);
  const { data: groupSchedules } = useSchedules("GROUP", true);

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

        <button
          onClick={() => router.push("/schedule")}
          className="typo-caption-2 text-accent hover:underline"
        >
          전체 보기
        </button>
      </Between>

      {upcomingEvents.length === 0 ? (
        <p className="py-6 text-center typo-caption-2 text-muted">
          다가오는 일정이 없습니다.
        </p>
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
