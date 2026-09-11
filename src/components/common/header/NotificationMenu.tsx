"use client";

import { usePathname, useRouter } from "next/navigation";

import NotificationBell from "@/src/components/notification/NotificationBell";
import { Notification } from "@/src/types/notification";

export default function NotificationMenu({
  className,
  triggerClassName,
  mobileSlot,
}: {
  className?: string;
  triggerClassName?: string;
  mobileSlot?: "top" | "sub";
}) {
  const router = useRouter();
  const pathname = usePathname();
  const isSchedulePage = pathname === "/schedule";

  if (mobileSlot === "top" && isSchedulePage) return null;
  if (mobileSlot === "sub" && !isSchedulePage) return null;
  const items: Notification[] = [];
  const unreadCount = 0;
  const loading = false;
  const hasMore = false;
  const loadingMore = false;

  const markRead = (notificationNo: number) => {
    void notificationNo;
  };

  const markAllRead = () => {};

  const loadMore = () => {};

  const handleSelect = (notification: Notification) => {
    if (!notification.read) markRead(notification.notificationNo);

    if (notification.targetNo) {
      router.push(`/group/${notification.targetNo}`);
    }
  };

  return (
    <NotificationBell
      items={items}
      unreadCount={unreadCount}
      loading={loading}
      hasMore={hasMore}
      loadingMore={loadingMore}
      onSelect={handleSelect}
      onReadAll={markAllRead}
      onLoadMore={loadMore}
      className={className}
      triggerClassName={triggerClassName}
    />
  );
}
