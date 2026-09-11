type NotificationType =
  | "GROUP_JOIN_REQUESTED"
  | "GROUP_JOIN_APPROVED"
  | "GROUP_JOIN_REJECTED"
  | "GROUP_SCHEDULE_CREATED";

export interface Notification {
  notificationNo: number;
  type: NotificationType;
  title: string;
  content: string;
  targetNo: number | null;
  read: boolean;
  senderNickname: string | null;
  senderProfileImageUrl: string | null;
  createdAt: string;
}
