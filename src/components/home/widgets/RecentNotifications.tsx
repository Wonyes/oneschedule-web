"use client";

import { Bell } from "lucide-react";

import BaseCard from "@/src/components/ui/card/BaseCard";
import { NotificationRowSkeleton } from "@/src/components/ui/SkeletonParts";
import { Column, Row } from "@/src/components/ui/layout/flex";
import {
  useNotification,
  useOpenNotification,
} from "@/src/hooks/querys/useNotification";
import NotificationItem from "../../notification/NotificationItem";
import EmptyState from "../../ui/EmptyState";

/** 헤더 종과 같은 쿼리를 쓰고 앞에서 몇 개만 보여준다.
 *  size를 다르게 주면 queryKey가 갈라져 같은 목록을 두 번 받아온다 */
const SHOW = 4;

/** 다가오는 일정 아래: 최근 알림 몇 개. 전체 목록은 헤더 종 아이콘에서 */
export default function RecentNotifications() {
  const { data, isLoading } = useNotification();
  const open = useOpenNotification();

  const items = (data?.pages[0]?.content ?? []).slice(0, SHOW);

  return (
    <BaseCard className="p-4 sm:p-5">
      <Row className="mb-3 items-center gap-2">
        <Bell size={14} strokeWidth={1.75} className="text-accent" />
        <span className="typo-sub-t-1 text-foreground">최근 알림</span>
      </Row>

      {isLoading ? (
        <Column className="gap-1">
          <NotificationRowSkeleton compact />
          <NotificationRowSkeleton compact />
        </Column>
      ) : items.length === 0 ? (
        <EmptyState title="아직 받은 알림이 없어요." className="py-3" />
      ) : (
        <Column className="gap-1">
          {items.map((n) => (
            <NotificationItem
              key={n.notificationNo}
              notification={n}
              onClick={open}
              compact
            />
          ))}
        </Column>
      )}
    </BaseCard>
  );
}
