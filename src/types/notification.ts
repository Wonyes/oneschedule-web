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
  | "GROUP_OWNER_TRANSFERRED"
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
  /** 일정 알림만 채워진다 (YYYY-MM-DD). 클릭하면 그 날짜의 일간 뷰로 */
  scheduleDate: string | null;
  read: boolean;
  senderNickname: string | null;
  senderProfileImageUrl: string | null;
  createdAt: string;
}
