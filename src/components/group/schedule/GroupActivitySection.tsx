"use client";

import { CalendarPlus } from "lucide-react";
import { useMemo } from "react";
import { format } from "date-fns";
import { ko } from "date-fns/locale";

import MemberAvatar from "../../common/MemberAvatar";
import BaseCard from "../../ui/card/BaseCard";
import SectionBody from "../dashboard/SectionBody";
import Skeleton from "../../ui/Skeleton";
import { Column, Row } from "../../ui/layout/flex";
import { EVENT_STYLES } from "@/src/constant/schedule";
import { useSchedules } from "@/src/hooks/querys/useSchedule";
import { useSheetStore } from "@/src/hooks/stores/useSheetStore";
import { MyGroupResponse } from "@/src/types/group";
import { cn } from "@/src/utils/cn";
import { toScheduleEvent } from "@/src/utils/schedule";
import { formatRelativeTime } from "@/src/utils/time";
import SectionHeading from "../../ui/layout/SectionHeading";
import EmptyState from "../../ui/EmptyState";

const MAX_ITEMS = 4;

export default function GroupActivitySection({
  group,
  animate = false,
}: {
  group: MyGroupResponse;
  animate?: boolean;
}) {
  const { data: groupSchedules, isLoading } = useSchedules(
    "GROUP",
    true,
    group.groupNo,
  );
  const { openSheet } = useSheetStore();

  const recent = useMemo(() => {
    return [...(groupSchedules ?? [])]
      .filter((schedule) => !!schedule.createdAt)
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      )
      .slice(0, MAX_ITEMS);
  }, [groupSchedules]);

  return (
    <BaseCard className="flex flex-col p-4 sm:p-5" childClass="flex flex-col">
      <SectionHeading className="mb-3" eyebrow="ACTIVITY" title="최근 활동" />

      <SectionBody animate={animate}>
        {isLoading ? (
          <Column className="w-full gap-3">
            {Array.from({ length: 2 }).map((_, i) => (
              <Row key={i} className="w-full gap-3">
                <Skeleton className="h-8 w-8 rounded-full" />
                <Column className="flex-1 gap-1.5">
                  <Skeleton className="h-3 w-48" />
                  <Skeleton className="h-2.5 w-28" />
                </Column>
              </Row>
            ))}
          </Column>
        ) : recent.length === 0 ? (
          <EmptyState
            title="아직 그룹에 등록된 일정이 없어요."
            action={
              <button
                type="button"
                onClick={() => openSheet({ date: new Date(), type: "GROUP" })}
                className="btn-spring neu-btn flex h-9 items-center gap-1.5 rounded-xl px-4 typo-caption-2 font-medium text-secondary hover:text-foreground"
              >
                <CalendarPlus size={14} strokeWidth={2} />첫 그룹 일정 만들기
              </button>
            }
          />
        ) : (
          <div className="relative w-full">
            <span
              aria-hidden
              className="absolute bottom-4 left-4 top-4 border-l border-dashed border-divider"
            />

            {recent.map((schedule) => {
              const style =
                EVENT_STYLES[schedule.category as keyof typeof EVENT_STYLES];
              const author = schedule.author ?? { nickname: "알 수 없음" };
              const count = schedule.participants?.length ?? 0;
              const start = new Date(toScheduleEvent(schedule).startDate);

              return (
                <Row
                  key={schedule.id}
                  className="relative w-full items-start gap-3 py-2"
                >
                  <MemberAvatar
                    nickname={author.nickname}
                    size="sm"
                    className="relative ring-4 ring-[var(--surface)]"
                  />

                  <Column className="min-w-0 flex-1 gap-0.5 pt-1">
                    <p className="truncate typo-caption-2 text-secondary">
                      <span className="font-semibold text-foreground">
                        {author.nickname}
                      </span>
                      님이{" "}
                      <span className="font-semibold text-foreground">
                        {schedule.title || "제목 없는 일정"}
                      </span>
                      {" 일정을 추가했어요"}
                    </p>

                    <Row className="gap-1.5 typo-caption-3 text-place-h">
                      <span
                        className={cn(
                          "h-1.5 w-1.5 shrink-0 rounded-full",
                          style?.dot ?? "bg-accent",
                        )}
                      />
                      <span className="tabular-nums">
                        {format(start, "M/d(EEE) HH:mm", { locale: ko })}
                      </span>
                      {count > 0 && (
                        <>
                          <span>·</span>
                          <span>참여 {count}명</span>
                        </>
                      )}
                    </Row>
                  </Column>

                  <span className="shrink-0 whitespace-nowrap pt-1 typo-caption-3 text-place-h">
                    {formatRelativeTime(schedule.createdAt)}
                  </span>
                </Row>
              );
            })}
          </div>
        )}
      </SectionBody>
    </BaseCard>
  );
}
