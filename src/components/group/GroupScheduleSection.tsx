"use client";

import { useMemo } from "react";
import { startOfDay, endOfDay } from "date-fns";

import BaseCard from "../ui/card/BaseCard";
import { Column, Row } from "../ui/layout/flex";
import { useSchedules } from "@/src/hooks/querys/useSchedule";
import { toScheduleEvent } from "@/src/utils/schedule";
import { MyGroupResponse } from "@/src/types/group";
import { getTimes } from "@/src/utils/time";

export default function GroupScheduleSection({
  group,
}: {
  group: MyGroupResponse;
}) {
  const { data: schedules } = useSchedules("GROUP", true, group.groupNo);

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
              time={getTimes(event.startDate, event.endDate)}
              author={event.author.nickname}
              title={event.title}
            />
          ))}
        </Column>
      )}
    </BaseCard>
  );
}

function ScheduleItem({
  time,
  title,
  author,
}: {
  time: string;
  title: string;
  author?: string;
}) {
  return (
    <Row className="w-full min-w-0 gap-2 rounded-lg px-3 py-2.5 neu-flat">
      <span className="w-[82px] shrink-0 typo-caption-2 tabular-nums text-place-h">
        {time}
      </span>

      <Row className="min-w-0 flex-1 items-center gap-1.5">
        <span className="min-w-0 flex-1 truncate typo-caption-2 font-medium">
          {title}
        </span>

        {author && (
          <span className="max-w-[60px] shrink-0 truncate typo-caption-3 text-place-h">
            {author}
          </span>
        )}
      </Row>
    </Row>
  );
}
