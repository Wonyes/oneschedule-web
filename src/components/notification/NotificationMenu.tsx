"use client";

import { usePathname, useRouter } from "next/navigation";

import NotificationBell from "@/src/components/notification/NotificationBell";
import { Notification } from "@/src/types/notification";
import {
  useAllreadNotifications,
  useNotification,
  useUnreadNotifications,
  useUpdateNotificationReadStatus,
} from "@/src/hooks/querys/useNotification";

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

  const {
    data: notifications,
    isLoading,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useNotification();
  const { data: unreadCount = 0 } = useUnreadNotifications();
  const { mutate: markRead } = useUpdateNotificationReadStatus();
  const { mutate: markAllRead } = useAllreadNotifications();

  const items = notifications?.pages.flatMap((page) => page.content) ?? [];

  if (mobileSlot === "top" && isSchedulePage) return null;
  if (mobileSlot === "sub" && !isSchedulePage) return null;

  const handleSelect = (notification: Notification) => {
    if (!notification.read) markRead(notification.notificationNo);

    if (notification.targetNo) {
      router.push(`/group/${notification.targetNo}`);
    }
  };

  return (
    <NotificationBell
      items={items}
      loading={isLoading}
      className={className}
      hasMore={hasNextPage}
      onSelect={handleSelect}
      unreadCount={unreadCount}
      onReadAll={() => markAllRead()}
      loadingMore={isFetchingNextPage}
      onLoadMore={() => fetchNextPage()}
      triggerClassName={triggerClassName}
    />
  );
}
