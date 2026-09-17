import { PAGE_SIZE } from "@/src/lib/paging";
import { usePagedQuery } from "./usePagedQuery";
import { notificationkeys } from "./key/notificationKey";
import { Notification } from "@/src/types/notification";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { Get, Patch } from "./useMutations";
import { useAppMutation } from "@/src/types/ErrorResponse";

export const useNotification = (
  enabled = true,
  size: number = PAGE_SIZE.notifications,
) => {
  return usePagedQuery<Notification>({
    queryKey: [notificationkeys.list],
    url: "/notifications",
    size,
    enabled,
  });
};

export const useUnreadNotifications = () => {
  return useQuery({
    queryKey: [notificationkeys.unreadCount],
    queryFn: () => Get<number>({ url: "/notifications/unread-count" }),
  });
};

export const useUpdateNotificationReadStatus = () => {
  const queryClient = useQueryClient();

  return useAppMutation({
    mutationFn: (notificationNo: number) =>
      Patch({
        url: `/notifications/${notificationNo}/read`,
      }),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [notificationkeys.list],
      });
      queryClient.invalidateQueries({
        queryKey: [notificationkeys.unreadCount],
      });
    },
  });
};

export const useAllreadNotifications = () => {
  const queryClient = useQueryClient();

  return useAppMutation({
    mutationFn: () =>
      Patch({
        url: `/notifications/read-all`,
      }),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [notificationkeys.unreadCount],
      });
      queryClient.invalidateQueries({
        queryKey: [notificationkeys.list],
      });
    },
  });
};

/** 알림 클릭: 안 읽었으면 읽음 처리하고, 대상 그룹이 있으면 이동 */
export const useOpenNotification = () => {
  const router = useRouter();
  const { mutate: markRead } = useUpdateNotificationReadStatus();

  return (notification: Notification) => {
    if (!notification.read) markRead(notification.notificationNo);
    if (notification.targetNo) router.push(`/group/${notification.targetNo}`);
  };
};
