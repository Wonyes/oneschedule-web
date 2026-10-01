"use client";

import { usePathname } from "next/navigation";

import NotificationBell from "@/src/components/notification/NotificationBell";
import {
  useAllreadNotifications,
  useNotification,
  useUnreadNotifications,
  useOpenNotification,
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
  const handleSelect = useOpenNotification();
  const { mutate: markAllRead } = useAllreadNotifications();

  const items = notifications?.pages.flatMap((page) => page.content) ?? [];

  if (mobileSlot === "top" && isSchedulePage) return null;
  if (mobileSlot === "sub" && !isSchedulePage) return null;

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
