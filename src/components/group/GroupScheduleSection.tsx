"use client";

import { format, isTomorrow } from "date-fns";
import { ko } from "date-fns/locale";
import { CalendarPlus } from "lucide-react";

import BaseCard from "../ui/card/BaseCard";
import { GROUP_SECTION_HEIGHT } from "./sectionHeight";
import { Column, Row } from "../ui/layout/flex";
import ScrollListArea, { ScrollSentinel } from "../ui/ScrollListArea";
import SectionBody from "./SectionBody";
import { UPCOMING_RANGE_DAYS, useGroupSchedules } from "./useGroupSchedules";
import { useIncrementalList } from "@/src/hooks/useIncrementalList";
import { useSheetStore } from "@/src/hooks/stores/useSheetStore";
import { PAGE_SIZE } from "@/src/lib/paging";
import { MyGroupResponse } from "@/src/types/group";
import { ScheduleEvent } from "@/src/types/schedule";
import { getTimes } from "@/src/utils/time";

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

  return (
    <BaseCard
      className={`flex flex-col p-5 ${GROUP_SECTION_HEIGHT}`}
      childClass="flex min-h-0 flex-1 flex-col"
    >
      <Row className="mb-4 shrink-0 items-start justify-between gap-3">
        <Column className="gap-1">
          <span className="eyebrow">SCHEDULE</span>
          <h2 className="typo-sub-t-1 text-foreground">그룹 일정</h2>
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
          <Column className="flex-1 items-center justify-center gap-1 py-10 text-center">
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
            className="scroll-hidden flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto pb-3"
          >
            <Group
              title="오늘"
              meta={format(new Date(), "M월 d일 EEEE", { locale: ko })}
            >
              {today.length === 0 ? (
                <span className="typo-caption-3 px-1 text-place-h">
                  오늘은 비어 있어요.
                </span>
              ) : (
                today.map((event) => (
                  <ScheduleItem key={event.id} event={event} />
                ))
              )}
            </Group>

            {upcoming.length > 0 && (
              <Group
                title={`다가오는 ${UPCOMING_RANGE_DAYS}일`}
                meta={`${upcoming.length}개`}
              >
                {visibleUpcoming.map((event) => (
                  <ScheduleItem key={event.id} event={event} showDay />
                ))}
                {hasMore && <ScrollSentinel sentinelRef={sentinelRef} />}
              </Group>
            )}
          </ScrollListArea>
        )}
      </SectionBody>
    </BaseCard>
  );
}

function Group({
  title,
  meta,
  children,
}: {
  title: string;
  meta: string;
  children: React.ReactNode;
}) {
  return (
    <Column className="w-full gap-2">
      <Row className="items-baseline gap-2 px-1">
        <span className="typo-caption-2 font-semibold text-foreground">
          {title}
        </span>
        <span className="typo-caption-3 text-place-h">{meta}</span>
      </Row>
      {children}
    </Column>
  );
}

function ScheduleItem({
  event,
  showDay = false,
}: {
  event: ScheduleEvent;
  showDay?: boolean;
}) {
  const start = new Date(event.startDate);
  const day = isTomorrow(start)
    ? "내일"
    : format(start, "M/d EEE", { locale: ko });

  return (
    <Row className="neu-flat w-full min-w-0 gap-3 rounded-lg px-3 py-2.5">
      <Column className="w-[92px] shrink-0 gap-0">
        {showDay && (
          <span className="typo-caption-3 font-semibold text-accent">
            {day}
          </span>
        )}
        <span className="typo-caption-3 tabular-nums text-place-h">
          {getTimes(event.startDate, event.endDate)}
        </span>
      </Column>

      <span className="min-w-0 flex-1 truncate typo-caption-2 font-medium text-foreground">
        {event.title}
      </span>

      {event.author?.nickname && (
        <span className="max-w-[72px] shrink-0 truncate typo-caption-3 text-place-h">
          {event.author.nickname}
        </span>
      )}
    </Row>
  );
}
