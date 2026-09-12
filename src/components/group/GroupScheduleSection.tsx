"use client";

import { isSameDay } from "date-fns";
import { CalendarPlus } from "lucide-react";

import BaseCard from "../ui/card/BaseCard";
import { GROUP_SECTION_MAX_HEIGHT } from "./sectionHeight";
import { Column, Row } from "../ui/layout/flex";
import ScrollListArea, { ScrollSentinel } from "../ui/ScrollListArea";
import SectionBody from "./SectionBody";
import { UPCOMING_RANGE_DAYS, useGroupSchedules } from "./useGroupSchedules";
import { DayGroup } from "../schedule/components/DayTimeline";
import { useIncrementalList } from "@/src/hooks/useIncrementalList";
import { useSheetStore } from "@/src/hooks/stores/useSheetStore";
import { PAGE_SIZE } from "@/src/lib/paging";
import { MyGroupResponse } from "@/src/types/group";
import { ScheduleEvent } from "@/src/types/schedule";

export default function GroupScheduleSection({
  group,
  animate = false,
}: {
  group: MyGroupResponse;
  animate?: boolean;
}) {
  const { today, upcoming } = useGroupSchedules(group.groupNo);
  const { openSheet } = useSheetStore();

  const {
    visible: visibleUpcoming,
    hasMore,
    rootRef,
    sentinelRef,
  } = useIncrementalList(upcoming, PAGE_SIZE.todaySchedules);

  const isEmpty = today.length === 0 && upcoming.length === 0;
  const days = groupByDay(visibleUpcoming);

  return (
    <BaseCard
      className={`flex flex-col p-5 ${GROUP_SECTION_MAX_HEIGHT}`}
      childClass="flex min-h-0 flex-1 flex-col"
    >
      <Row className="mb-4 shrink-0 items-start justify-between gap-3">
        <Column className="gap-1">
          <span className="eyebrow">SCHEDULE</span>
          <Row className="items-baseline gap-2">
            <h2 className="typo-sub-t-1 text-foreground">그룹 일정</h2>
            {!isEmpty && (
              <span className="typo-caption-3 text-place-h">
                오늘 {today.length} · {UPCOMING_RANGE_DAYS}일 내{" "}
                {upcoming.length}
              </span>
            )}
          </Row>
        </Column>

        <button
          type="button"
          onClick={() => openSheet({ date: new Date(), type: "GROUP" })}
          className="btn-primary btn-spring flex h-9 shrink-0 items-center gap-1.5 rounded-xl px-3.5 typo-caption-2 font-semibold"
        >
          <CalendarPlus size={14} strokeWidth={2} />
          일정 추가
        </button>
      </Row>

      <SectionBody animate={animate}>
        {isEmpty ? (
          <Column className="items-center justify-center gap-1 py-8 text-center">
            <span className="typo-caption-1 text-secondary">
              앞으로 {UPCOMING_RANGE_DAYS}일 동안 그룹 일정이 없어요.
            </span>
            <span className="typo-caption-3 text-place-h">
              일정을 추가하면 멤버들에게 알림이 가요.
            </span>
          </Column>
        ) : (
          <ScrollListArea
            rootRef={rootRef}
            showFade={hasMore}
            className="scroll-hidden flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto pb-2"
          >
            <DayGroup
              date={new Date()}
              events={today}
              emptyText="오늘은 비어 있어요."
            />

            {days.map(({ date, events }) => (
              <DayGroup key={date.toISOString()} date={date} events={events} />
            ))}

            {hasMore && <ScrollSentinel sentinelRef={sentinelRef} />}
          </ScrollListArea>
        )}
      </SectionBody>
    </BaseCard>
  );
}

function groupByDay(events: ScheduleEvent[]) {
  const days: { date: Date; events: ScheduleEvent[] }[] = [];

  for (const event of events) {
    const date = new Date(event.startDate);
    const last = days[days.length - 1];

    if (last && isSameDay(last.date, date)) last.events.push(event);
    else days.push({ date, events: [event] });
  }

  return days;
}
