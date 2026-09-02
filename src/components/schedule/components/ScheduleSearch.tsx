"use client";

import { format } from "date-fns";
import { Search, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

import { Column, Row } from "@/src/components/ui/layout/flex";
import { useSchedules } from "@/src/hooks/querys/useSchedule";
import { useScheduleStore } from "@/src/hooks/stores/useScheduleStore";
import { useSheetStore } from "@/src/hooks/stores/useSheetStore";
import { EVENT_STYLES } from "@/src/constant/schedule";
import { ScheduleEvent } from "@/src/types/schedule";
import { toScheduleEvent } from "@/src/utils/schedule";

const MAX_RESULTS = 20;

/**
 * 일정 검색. 개인/그룹 일정은 이미 클라이언트 캐시에 있으므로
 * 별도 검색 API 없이 제목·메모를 대상으로 필터링한다.
 */
export default function ScheduleSearch() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const setCurrentDate = useScheduleStore((s) => s.setCurrentDate);
  const { openSheet } = useSheetStore();

  const { data: personalSchedules } = useSchedules("PERSONAL");
  const { data: groupSchedules } = useSchedules("GROUP");

  const results = useMemo(() => {
    const keyword = query.trim().toLowerCase();
    if (!keyword) return [];

    const combined = [
      ...(personalSchedules ?? []),
      ...(groupSchedules ?? []),
    ].map(toScheduleEvent);

    // id 중복(개인/그룹 양쪽에 잡히는 경우) 제거
    const unique = new Map<number, ScheduleEvent>();
    combined.forEach((event) => unique.set(event.id, event));

    return [...unique.values()]
      .filter((event) =>
        `${event.title} ${event.content ?? ""}`.toLowerCase().includes(keyword),
      )
      .sort(
        (a, b) =>
          new Date(b.startDate).getTime() - new Date(a.startDate).getTime(),
      )
      .slice(0, MAX_RESULTS);
  }, [query, personalSchedules, groupSchedules]);

  useEffect(() => {
    if (!isOpen) return;

    inputRef.current?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen]);

  const close = () => {
    setIsOpen(false);
    setQuery("");
  };

  const goToEvent = (event: ScheduleEvent) => {
    setCurrentDate(new Date(event.startDate));
    openSheet({ event });
    close();
  };

  if (!isOpen) {
    return (
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        aria-label="일정 검색"
        className="btn-spring text-secondary hover:text-foreground flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
      >
        <Search size={15} strokeWidth={1.75} />
      </button>
    );
  }

  return (
    <>
      <div
        className="fixed inset-0 z-[9990] bg-black/50"
        onClick={close}
        aria-hidden="true"
      />

      <div
        role="dialog"
        aria-label="일정 검색"
        className="glass fixed left-1/2 top-24 z-[9999] w-[calc(100%-32px)] max-w-[520px] -translate-x-1/2 rounded-2xl p-3"
      >
        <Row className="neu-pressed gap-2 rounded-xl px-3 py-2.5">
          <Search size={15} strokeWidth={1.75} className="text-muted shrink-0" />

          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="일정 제목이나 메모로 검색"
            className="typo-caption-2 text-foreground placeholder:text-place-h w-full bg-transparent focus:outline-none"
          />

          <button
            type="button"
            onClick={close}
            aria-label="검색 닫기"
            className="text-muted hover:text-foreground shrink-0"
          >
            <X size={15} strokeWidth={1.75} />
          </button>
        </Row>

        <div className="mt-2 max-h-[50vh] overflow-y-auto">
          {!query.trim() ? (
            <p className="typo-caption-2 text-muted px-2 py-6 text-center">
              검색어를 입력해 주세요.
            </p>
          ) : results.length === 0 ? (
            <p className="typo-caption-2 text-muted px-2 py-6 text-center">
              &quot;{query.trim()}&quot;에 해당하는 일정이 없어요.
            </p>
          ) : (
            <Column className="gap-1">
              {results.map((event) => {
                const style =
                  EVENT_STYLES[event.category as keyof typeof EVENT_STYLES];

                return (
                  <button
                    key={event.id}
                    type="button"
                    onClick={() => goToEvent(event)}
                    className="hover:bg-surface-hover flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left transition-colors"
                  >
                    <span
                      className={`h-2 w-2 shrink-0 rounded-full ${style?.dot ?? "bg-accent"}`}
                    />

                    <Column className="min-w-0 flex-1 gap-0.5">
                      <span className="typo-caption-1 text-foreground truncate font-medium">
                        {event.title}
                      </span>
                      <span className="typo-caption-3 text-muted">
                        {format(new Date(event.startDate), "yyyy. MM. dd HH:mm")}
                      </span>
                    </Column>
                  </button>
                );
              })}
            </Column>
          )}
        </div>
      </div>
    </>
  );
}
