"use client";

import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";
import { Activity, CalendarPlus } from "lucide-react";
import { useMemo } from "react";

import BaseCard from "../ui/card/BaseCard";
import { Column, Row } from "../ui/layout/flex";
import { EVENT_STYLES } from "@/src/constant/schedule";
import { useSchedules } from "@/src/hooks/querys/useSchedule";
import { useSheetStore } from "@/src/hooks/stores/useSheetStore";

const MAX_ITEMS = 4;

export default function GroupActivitySection() {
  const { data: groupSchedules, isLoading } = useSchedules("GROUP");
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
    <BaseCard glow className="p-5">
      <Column className="mb-3 gap-1.5">
        <span className="eyebrow">ACTIVITY</span>
        <Row className="gap-1.5">
          <Activity size={16} strokeWidth={1.5} className="text-muted" />
          <h2 className="typo-sub-t-1 text-foreground">최근 활동</h2>
        </Row>
      </Column>

      {isLoading ? (
        <Column className="w-full gap-2">
          {Array.from({ length: 2 }).map((_, i) => (
            <div
              key={i}
              className="neu-flat h-14 w-full animate-pulse rounded-lg"
            />
          ))}
        </Column>
      ) : recent.length === 0 ? (
        <Column className="neu-flat w-full items-center gap-3 rounded-lg px-4 py-6">
          <span className="typo-caption-2 text-muted">
            아직 그룹에 등록된 일정이 없어요.
          </span>
          <button
            type="button"
            onClick={() => openSheet({ date: new Date() })}
            className="btn-spring neu-btn text-secondary hover:text-foreground flex h-9 items-center gap-1.5 rounded-xl px-4 typo-caption-2 font-medium"
          >
            <CalendarPlus size={14} strokeWidth={2} />첫 그룹 일정 만들기
          </button>
        </Column>
      ) : (
        <Column className="w-full gap-2">
          {recent.map((schedule) => {
            const style =
              EVENT_STYLES[schedule.category as keyof typeof EVENT_STYLES];

            const participants = schedule.participants ?? [];
            const names = participants
              .slice(0, 2)
              .map((p) => p.nickname)
              .join(", ");

            return (
              <Row
                key={schedule.id}
                className="neu-flat w-full gap-3 rounded-lg px-4 py-3"
              >
                <span
                  className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${style?.dot ?? "bg-accent"}`}
                />

                <Column className="min-w-0 flex-1 gap-0.5">
                  <span className="typo-caption-1 text-foreground truncate font-medium">
                    {schedule.title || "제목 없는 일정"}
                  </span>
                  <span className="typo-caption-3 text-muted truncate">
                    {participants.length > 0
                      ? `${names}${participants.length > 2 ? ` 외 ${participants.length - 2}명` : ""} · 일정 등록`
                      : "일정 등록"}
                  </span>
                </Column>

                <span className="typo-caption-3 text-place-h shrink-0 whitespace-nowrap">
                  {formatDistanceToNow(new Date(schedule.createdAt), {
                    addSuffix: true,
                    locale: ko,
                  })}
                </span>
              </Row>
            );
          })}
        </Column>
      )}
    </BaseCard>
  );
}
