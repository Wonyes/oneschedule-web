"use client";

import Link from "next/link";

import { cn } from "@/src/utils/cn";

const SIZE = { sm: "h-8 w-8", md: "h-9 w-9" } as const;

/** 오빗 위성 "+N". href면 Link, 아니면 button */
export default function OrbitMore({
  count,
  label,
  href,
  onClick,
  size = "md",
}: {
  count: number;
  label: string;
  href?: string;
  onClick?: () => void;
  size?: keyof typeof SIZE;
}) {
  const className = cn(
    "neu-flat flex items-center justify-center rounded-full typo-caption-3 font-semibold text-muted btn-spring hover:scale-110",
    SIZE[size],
  );

  if (href) {
    return (
      <Link href={href} prefetch aria-label={label} className={className}>
        +{count}
      </Link>
    );
  }

  return (
    <button type="button" onClick={onClick} aria-label={label} className={className}>
      +{count}
    </button>
  );
}
