"use client";

import { formatDistanceToNowStrict } from "date-fns";
import { ko } from "date-fns/locale";

import MemberAvatar from "@/src/components/common/MemberAvatar";
import { Notification } from "@/src/types/notification";
import { cn } from "@/src/utils/cn";
import { motion } from "motion/react";
import { springSoft } from "@/src/lib/motion";
import { notificationIcon } from "./notificationIcons";

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

  const { icon, tone } = notificationIcon(type);

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
      {senderNickname === null ? (
        <span
          className={cn(
            "flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
            tone,
          )}
        >
          {icon}
        </span>
      ) : (
        // 사람이 보낸 알림: 아바타 + 모서리에 타입 배지
        <span className="relative shrink-0">
          <MemberAvatar
            nickname={senderNickname}
            src={senderProfileImageUrl}
            size="sm"
          />
          <span
            className={cn(
              "absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full ring-2 ring-[var(--surface)] [&>svg]:h-2.5 [&>svg]:w-2.5",
              tone,
            )}
          >
            {icon}
          </span>
        </span>
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
