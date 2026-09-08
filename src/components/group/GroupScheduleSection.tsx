"use client";

import { useMemo } from "react";
import { startOfDay, endOfDay } from "date-fns";

import BaseCard from "../ui/card/BaseCard";
import { Column, Row } from "../ui/layout/flex";
import { useSchedules } from "@/src/hooks/querys/useSchedule";
import { toScheduleEvent } from "@/src/utils/schedule";
import { MyGroupResponse } from "@/src/types/group";
import { getTimes } from "@/src/utils/time";
import { useIncrementalList } from "@/src/hooks/useIncrementalList";

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

  // 멤버 목록과 같은 방식으로 5개씩 이어 붙인다
  const {
    visible: visibleEvents,
    hasMore,
    rootRef,
    sentinelRef,
  } = useIncrementalList(todayEvents, 5);

  return (
    <BaseCard glow className="flex-1 p-5 lg:min-h-[380px]">
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
        <div
          ref={rootRef}
          className="scroll-hidden flex flex-col gap-2.5 px-1 py-1 lg:-mx-4 lg:max-h-[304px] lg:overflow-y-auto lg:px-4 lg:pt-3 lg:pb-4"
        >
          {visibleEvents.map((event) => (
            <ScheduleItem
              key={event.id}
              time={getTimes(event.startDate, event.endDate)}
              author={event.author.nickname}
              title={event.title}
            />
          ))}

          {hasMore && <div ref={sentinelRef} className="h-1 shrink-0" />}
        </div>
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
