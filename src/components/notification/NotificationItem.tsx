"use client";

import { Bell, Check, X } from "lucide-react";
import { formatDistanceToNowStrict } from "date-fns";
import { ko } from "date-fns/locale";

import MemberAvatar from "@/src/components/common/MemberAvatar";
import { Notification } from "@/src/types/notification";
import { cn } from "@/src/utils/cn";
import { motion } from "motion/react";
import { springSoft } from "@/src/lib/motion";

const SYSTEM_ICON = {
  GROUP_JOIN_APPROVED: {
    icon: <Check size={14} strokeWidth={2.5} />,
    tone: "bg-success-500/15 text-success-500",
  },
  GROUP_JOIN_REJECTED: {
    icon: <X size={14} strokeWidth={2.5} />,
    tone: "bg-surface-hover text-muted",
  },
} as const;

function emphasize(title: string, name: string | null) {
  if (!name || !title.includes(name)) return title;

  const [before, ...rest] = title.split(name);
  return (
    <>
      {before}
      <b className="font-semibold">{name}</b>
      {rest.join(name)}
    </>
  );
}

export default function NotificationItem({
  notification,
  onClick,
  compact = false,
}: {
  notification: Notification;
  onClick: (notification: Notification) => void;
  /** 홈 카드용 한 줄 레이아웃. 내용은 sm 이상에서만 */
  compact?: boolean;
}) {
  const { read, title, content, senderNickname, senderProfileImageUrl, type } =
    notification;

  const system =
    senderNickname === null
      ? (SYSTEM_ICON[type as keyof typeof SYSTEM_ICON] ?? {
          icon: <Bell size={14} strokeWidth={2} />,
          tone: "bg-accent/10 text-accent",
        })
      : null;

  const time = formatDistanceToNowStrict(new Date(notification.createdAt), {
    addSuffix: true,
    locale: ko,
  });

  return (
    <motion.button
      type="button"
      role={compact ? undefined : "menuitem"}
      layout
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={springSoft}
      onClick={() => onClick(notification)}
      className={cn(
        "flex w-full text-left transition-colors hover:bg-surface-hover",
        compact
          ? "items-center gap-2.5 rounded-lg px-1.5 py-1.5"
          : "items-start gap-3 rounded-xl px-3 py-2.5",
        read && "opacity-70",
      )}
    >
      {system ? (
        <span
          className={cn(
            "flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
            system.tone,
          )}
        >
          {system.icon}
        </span>
      ) : (
        <MemberAvatar
          nickname={senderNickname ?? ""}
          src={senderProfileImageUrl}
          size="sm"
        />
      )}

      {compact ? (
        <>
          <span className="flex min-w-0 flex-1 items-baseline gap-2">
            <span className="shrink-0 typo-caption-2 text-foreground">
              {emphasize(title, senderNickname)}
            </span>
            {content && (
              <span className="hidden min-w-0 flex-1 truncate typo-caption-3 text-muted sm:block">
                {content}
              </span>
            )}
          </span>
          <span className="shrink-0 typo-caption-3 text-place-h">{time}</span>
        </>
      ) : (
        <span className="flex min-w-0 flex-1 flex-col gap-0.5">
          <span className="typo-caption-2 text-foreground">
            {emphasize(title, senderNickname)}
          </span>
          {content && (
            <span className="typo-caption-3 text-muted">{content}</span>
          )}
          <span className="typo-caption-3 text-place-h">{time}</span>
        </span>
      )}

      {!read && (
        <span
          className={cn(
            "shrink-0 rounded-full bg-accent",
            compact ? "size-1.5" : "mt-1.5 size-2",
          )}
        />
      )}
    </motion.button>
  );
}
