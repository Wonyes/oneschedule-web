import { PAGE_SIZE } from "@/src/lib/paging";
import { usePagedQuery } from "./usePagedQuery";
import { notificationkeys } from "./key/notificationKey";
import { Notification } from "@/src/types/notification";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Get, Patch } from "./useMutations";
import { useAppMutation } from "@/src/types/ErrorResponse";

export const useNotification = (
  enabled = true,
  size = PAGE_SIZE.notifications,
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
