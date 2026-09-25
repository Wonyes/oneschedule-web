import {
  Bell,
  CalendarClock,
  CalendarMinus,
  CalendarPlus,
  Check,
  Crown,
  KeyRound,
  LogOut,
  Pencil,
  Shield,
  Sparkles,
  Trash2,
  UserMinus,
  UserPlus,
  Users,
  X,
} from "lucide-react";

import { NotificationType } from "@/src/types/notification";

type IconSpec = { icon: React.ReactNode; tone: string };

const sz = { size: 14, strokeWidth: 2 } as const;

/** 알림 타입별 아이콘과 색. 백엔드 NotificationType과 1:1 */
const ICONS: Record<NotificationType, IconSpec> = {
  WELCOME: { icon: <Sparkles {...sz} />, tone: "bg-accent/15 text-accent" },
  PASSWORD_CHANGE: {
    icon: <KeyRound {...sz} />,
    tone: "bg-pending-500/15 text-pending-500",
  },

  GROUP_JOIN_REQUESTED: {
    icon: <UserPlus {...sz} />,
    tone: "bg-accent/15 text-accent",
  },
  GROUP_JOIN_APPROVED: {
    icon: <Check {...sz} strokeWidth={2.5} />,
    tone: "bg-success-500/15 text-success-500",
  },
  GROUP_JOIN_REJECTED: {
    icon: <X {...sz} strokeWidth={2.5} />,
    tone: "bg-surface-hover text-muted",
  },

  GROUP_MEMBER_JOINED: {
    icon: <Users {...sz} />,
    tone: "bg-success-500/15 text-success-500",
  },
  GROUP_MEMBER_LEFT: {
    icon: <LogOut {...sz} />,
    tone: "bg-surface-hover text-muted",
  },
  GROUP_MEMBER_REMOVED: {
    icon: <UserMinus {...sz} />,
    tone: "bg-error-500/15 text-error-500",
  },
  GROUP_ROLE_CHANGED: {
    icon: <Shield {...sz} />,
    tone: "bg-pending-500/15 text-pending-500",
  },
  GROUP_OWNER_TRANSFERRED: {
    icon: <Crown {...sz} />,
    tone: "bg-pending-500/15 text-pending-500",
  },
  GROUP_DISBANDED: {
    icon: <Trash2 {...sz} />,
    tone: "bg-error-500/15 text-error-500",
  },

  GROUP_SCHEDULE_CREATED: {
    icon: <CalendarPlus {...sz} />,
    tone: "bg-accent/15 text-accent",
  },
  GROUP_SCHEDULE_UPDATED: {
    icon: <Pencil {...sz} />,
    tone: "bg-pending-500/15 text-pending-500",
  },
  GROUP_SCHEDULE_DELETED: {
    icon: <CalendarMinus {...sz} />,
    tone: "bg-error-500/15 text-error-500",
  },
  GROUP_SCHEDULE_REMINDER: {
    icon: <CalendarClock {...sz} />,
    tone: "bg-accent/15 text-accent",
  },
  SCHEDULE_PARTICIPANT_ADDED: {
    icon: <UserPlus {...sz} />,
    tone: "bg-success-500/15 text-success-500",
  },
  SCHEDULE_PARTICIPANT_REMOVED: {
    icon: <UserMinus {...sz} />,
    tone: "bg-surface-hover text-muted",
  },
};

const FALLBACK: IconSpec = {
  icon: <Bell {...sz} />,
  tone: "bg-accent/10 text-accent",
};

export const notificationIcon = (type: string): IconSpec =>
  ICONS[type as NotificationType] ?? FALLBACK;
