"use client";

import AvatarImage from "@/src/components/common/AvatarImage";
import { cn } from "@/src/utils/cn";

const SIZE = {
  xs: "h-6 w-6 rounded-lg text-[10px]",
  sm: "h-8 w-8 rounded-xl typo-caption-2",
  header: "h-9 w-9 rounded-xl typo-caption-2",
  md: "h-11 w-11 rounded-[14px] typo-caption-1",
  lg: "h-12 w-12 rounded-2xl typo-sub-t-2",
} as const;

export default function GroupAvatar({
  name,
  imageUrl,
  size = "sm",
  className,
}: {
  name: string;
  imageUrl?: string | null;
  size?: keyof typeof SIZE;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "neu-flat flex shrink-0 items-center justify-center overflow-hidden font-bold text-accent",
        SIZE[size],
        className,
      )}
    >
      <AvatarImage
        src={imageUrl}
        nickname={name}
        fallback={name.trim().charAt(0).toUpperCase()}
      />
    </span>
  );
}
