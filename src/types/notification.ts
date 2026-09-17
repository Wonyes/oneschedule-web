export type NotificationType =
  | "WELCOME"
  | "GROUP_JOIN_REQUESTED"
  | "GROUP_JOIN_APPROVED"
  | "GROUP_JOIN_REJECTED"
  | "GROUP_SCHEDULE_CREATED"
  | "PASSWORD_CHANGE"
  | "GROUP_MEMBER_JOINED"
  | "GROUP_MEMBER_LEFT"
  | "GROUP_MEMBER_REMOVED"
  | "GROUP_ROLE_CHANGED"
  | "GROUP_DISBANDED"
  | "GROUP_SCHEDULE_UPDATED"
  | "GROUP_SCHEDULE_DELETED"
  | "GROUP_SCHEDULE_REMINDER"
  | "SCHEDULE_PARTICIPANT_ADDED"
  | "SCHEDULE_PARTICIPANT_REMOVED";

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
