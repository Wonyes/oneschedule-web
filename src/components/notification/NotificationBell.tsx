"use client";

import { Bell } from "lucide-react";

import DropdownMenu from "@/src/components/ui/DropdownMenu";
import { Column, Row } from "@/src/components/ui/layout/flex";
import Skeleton from "@/src/components/ui/Skeleton";
import { Notification } from "@/src/types/notification";
import { cn } from "@/src/utils/cn";
import { AnimatePresence } from "motion/react";
import NotificationItem from "./NotificationItem";

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
  triggerClassName = "neu-btn h-8 w-8 rounded-full text-secondary",
}: NotificationBellProps) {
  const badge = unreadCount > 99 ? "99+" : unreadCount;

  return (
    <DropdownMenu
      label="알림"
      align="right"
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
            <Column className="gap-2 px-3 py-2">
              <Skeleton className="h-9 w-full rounded-xl" />
              <Skeleton className="h-9 w-full rounded-xl" />
              <Skeleton className="h-9 w-full rounded-xl" />
            </Column>
          ) : items.length === 0 ? (
            <Column className="items-center gap-2 px-3 py-8">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-surface-hover text-muted">
                <Bell size={16} strokeWidth={1.75} />
              </span>
              <span className="typo-caption-2 text-muted">
                아직 알림이 없어요.
              </span>
            </Column>
          ) : (
            <Column className="scroll-hidden max-h-[60vh] w-full gap-0.5 overflow-y-auto">
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
            </Column>
          )}

          {hasMore && (
            <div className="mt-1 border-t border-divider px-3 pt-2 text-center">
              <button
                type="button"
                disabled={loadingMore}
                onClick={onLoadMore}
                className={cn(
                  "typo-caption-3 text-accent hover:underline",
                  loadingMore && "opacity-50",
                )}
              >
                {loadingMore ? "불러오는 중…" : "이전 알림 더 보기"}
              </button>
            </div>
          )}
        </>
      )}
    </DropdownMenu>
  );
}
