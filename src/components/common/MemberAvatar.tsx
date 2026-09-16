"use client";

import AvatarImage from "@/src/components/common/AvatarImage";
import { cn } from "@/src/utils/cn";

// 24px 이하는 neu 그림자가 보이지 않아 평면 배경을 쓴다
const SIZE = {
  "2xs": "h-5 w-5 bg-accent/15 text-[9px]",
  xs: "h-6 w-6 bg-accent/15 text-[10px]",
  sm: "neu-flat h-8 w-8 typo-caption-3",
  md: "neu-flat h-9 w-9 typo-caption-3",
} as const;

export default function MemberAvatar({
  nickname,
  src,
  size = "md",
  className,
}: {
  nickname: string;
  src?: string | null;
  size?: keyof typeof SIZE;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "flex shrink-0 items-center justify-center overflow-hidden rounded-full font-bold text-accent",
        SIZE[size],
        className,
      )}
    >
      <AvatarImage src={src} nickname={nickname} />
    </span>
  );
}
