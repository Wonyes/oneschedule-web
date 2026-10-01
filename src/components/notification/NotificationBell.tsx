"use client";

import { Bell } from "lucide-react";
import { useEffect, useRef } from "react";

import DropdownMenu from "@/src/components/ui/DropdownMenu";
import { Column, Row } from "@/src/components/ui/layout/flex";
import { NotificationRowSkeleton } from "@/src/components/ui/SkeletonParts";
import { useMediaQuery } from "@/src/hooks/useMediaQuery";
import { Notification } from "@/src/types/notification";
import { cn } from "@/src/utils/cn";
import { AnimatePresence } from "motion/react";
import NotificationItem from "./NotificationItem";
import EmptyState from "../ui/EmptyState";

type NotificationBellProps = {
  items: Notification[];
  unreadCount: number;
  loading?: boolean;
  hasMore?: boolean;
  loadingMore?: boolean;
  onSelect: (notification: Notification) => void;
  onReadAll: () => void;
  onLoadMore?: () => void;
  className?: string;
  triggerClassName?: string;
};

export default function NotificationBell({
  items,
  unreadCount,
  loading = false,
  hasMore = false,
  loadingMore = false,
  onSelect,
  onReadAll,
  onLoadMore,
  className,
  triggerClassName = "neu-flat h-9 w-9 rounded-xl text-accent",
}: NotificationBellProps) {
  const badge = unreadCount > 99 ? "99+" : unreadCount;

  // 목록 바닥의 센티널이 보이면 다음 페이지 — "더 보기" 버튼 없이 스크롤 페이징
  const sentinelRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el || !hasMore || loadingMore || !onLoadMore) return;
    const io = new IntersectionObserver(
      (entries) => entries[0]?.isIntersecting && onLoadMore(),
      { root: el.parentElement, rootMargin: "40px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [hasMore, loadingMore, onLoadMore, items.length]);
  // 폰에선 패널을 화면 가로 중앙에 (세로 위치는 종 기준 그대로)
  const isDesktop = useMediaQuery("(min-width: 640px)");

  return (
    <DropdownMenu
      label="알림"
      align={isDesktop ? "right" : "center"}
      className={className}
      panelClassName="w-[340px] max-w-[calc(100vw-32px)]"
      triggerClassName={cn(
        "relative shrink-0 justify-center",
        triggerClassName,
      )}
      trigger={() => (
        <>
          <Bell size={16} strokeWidth={1.75} />
          {unreadCount > 0 && (
            <span className="absolute -right-1 -top-1 min-w-4 rounded-full bg-accent px-1 text-center text-[10px] font-bold leading-4 tabular-nums text-on-primary">
              {badge}
            </span>
          )}
        </>
      )}
    >
      {(close) => (
        <>
          <Row className="justify-between px-3 pb-2 pt-1.5">
            <Row className="items-center gap-1.5">
              <span className="typo-caption-1 font-semibold text-foreground">
                알림
              </span>
              {unreadCount > 0 && (
                <span className="rounded-full bg-accent/12 px-1.5 py-px text-[10px] font-bold tabular-nums text-accent">
                  {badge}
                </span>
              )}
            </Row>

            <button
              type="button"
              disabled={unreadCount === 0}
              onClick={onReadAll}
              className="typo-caption-3 text-muted hover:text-foreground disabled:cursor-default disabled:opacity-40"
            >
              모두 읽음
            </button>
          </Row>

          {loading ? (
            <Column className="gap-0.5">
              <NotificationRowSkeleton />
              <NotificationRowSkeleton />
              <NotificationRowSkeleton />
            </Column>
          ) : items.length === 0 ? (
            <EmptyState
              icon={<Bell size={16} strokeWidth={1.75} />}
              title="아직 알림이 없어요."
            />
          ) : (
            // 항목 4개(각 ≈60px) 높이까지만 보이고, 그 아래는 스크롤
            <Column className="scroll-hidden max-h-[248px] w-full gap-0.5 overflow-y-auto">
              <AnimatePresence initial={false}>
                {items.map((item) => (
                  <NotificationItem
                    key={item.notificationNo}
                    notification={item}
                    onClick={(n) => {
                      onSelect(n);
                      close();
                    }}
                  />
                ))}
              </AnimatePresence>

              {hasMore && (
                <div
                  ref={sentinelRef}
                  className="flex h-8 shrink-0 items-center justify-center typo-caption-3 text-place-h"
                >
                  {loadingMore ? "불러오는 중…" : ""}
                </div>
              )}
            </Column>
          )}
        </>
      )}
    </DropdownMenu>
  );
}
