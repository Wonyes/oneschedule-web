"use client";

import { formatDistanceToNowStrict } from "date-fns";
import { ko } from "date-fns/locale";
import { Bell } from "lucide-react";
import { useRouter } from "next/navigation";

import MemberAvatar from "@/src/components/common/MemberAvatar";
import BaseCard from "@/src/components/ui/card/BaseCard";
import Skeleton from "@/src/components/ui/Skeleton";
import { Column, Row } from "@/src/components/ui/layout/flex";
import {
  useNotification,
  useUpdateNotificationReadStatus,
} from "@/src/hooks/querys/useNotification";
import { Notification } from "@/src/types/notification";
import { cn } from "@/src/utils/cn";
import EmptyState from "../ui/EmptyState";

const SIZE = 4;

/** 다가오는 일정 아래: 최근 알림 몇 개. 전체 목록은 헤더 종 아이콘에서 */
export default function RecentNotifications() {
  const router = useRouter();
  const { data, isLoading } = useNotification(true, SIZE);
  const { mutate: markRead } = useUpdateNotificationReadStatus();

  const items = data?.pages[0]?.content ?? [];

  const handleSelect = (n: Notification) => {
    if (!n.read) markRead(n.notificationNo);
    if (n.targetNo) router.push(`/group/${n.targetNo}`);
  };

  return (
    <BaseCard className="p-4 sm:p-5">
      <Row className="mb-3 items-center gap-2">
        <Bell size={14} strokeWidth={1.75} className="text-accent" />
        <span className="typo-sub-t-1 text-foreground">최근 알림</span>
      </Row>

      {isLoading ? (
        <Column className="gap-2">
          <Skeleton className="h-9 w-full rounded-lg" />
          <Skeleton className="h-9 w-full rounded-lg" />
        </Column>
      ) : items.length === 0 ? (
        <EmptyState title="아직 받은 알림이 없어요." />
      ) : (
        <Column className="gap-1">
          {items.map((n) => (
            <button
              key={n.notificationNo}
              type="button"
              onClick={() => handleSelect(n)}
              className="btn-spring flex w-full items-center gap-2.5 rounded-lg px-1.5 py-1.5 text-left hover:bg-surface-hover"
            >
              {n.senderNickname === null ? (
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent/10 text-accent">
                  <Bell size={12} strokeWidth={2} />
                </span>
              ) : (
                <MemberAvatar
                  nickname={n.senderNickname}
                  src={n.senderProfileImageUrl}
                  size="sm"
                />
              )}

              <Row className="min-w-0 flex-1 items-baseline gap-2">
                <span
                  className={cn(
                    "shrink-0 typo-caption-2",
                    n.read ? "text-secondary" : "font-semibold text-foreground",
                  )}
                >
                  {n.title}
                </span>
                <span className="hidden min-w-0 flex-1 truncate typo-caption-3 text-muted sm:block">
                  {n.content}
                </span>
              </Row>
              <span className="shrink-0 typo-caption-3 text-place-h">
                {formatDistanceToNowStrict(new Date(n.createdAt), {
                  addSuffix: true,
                  locale: ko,
                })}
              </span>

              {!n.read && (
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
              )}
            </button>
          ))}
        </Column>
      )}
    </BaseCard>
  );
}
