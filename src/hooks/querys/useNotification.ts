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

/** 알림 종류별 이동 경로. null이면 이동하지 않는다.
 *  targetNo는 전부 groupNo다 — 일정 알림도 날짜를 안 실어 주므로 그룹으로만 보낸다 */
const notificationHref = ({ type, targetNo }: Notification): string | null => {
  switch (type) {
    // 내 계정 관련
    case "WELCOME":
    case "PASSWORD_CHANGE":
      return "/profile";

    // 그룹을 떠났거나 그룹이 사라진 경우 — 목록으로
    case "GROUP_JOIN_REJECTED":
    case "GROUP_MEMBER_REMOVED":
    case "GROUP_DISBANDED":
      return "/group";

    // 관리자가 처리할 것이 있는 경우 — 신청 탭으로 바로
    case "GROUP_JOIN_REQUESTED":
      return targetNo ? `/group/${targetNo}?tab=requests` : "/group";

    default:
      return targetNo ? `/group/${targetNo}` : null;
  }
};

/** 알림 클릭: 안 읽었으면 읽음 처리하고, 종류에 맞는 화면으로 이동 */
export const useOpenNotification = () => {
  const router = useRouter();
  const { mutate: markRead } = useUpdateNotificationReadStatus();

  return (notification: Notification) => {
    if (!notification.read) markRead(notification.notificationNo);

    const href = notificationHref(notification);
    if (href) router.push(href);
  };
};
