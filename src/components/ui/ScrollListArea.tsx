"use client";

import { cn } from "@/src/utils/cn";

export default function ScrollListArea({
  rootRef,
  className,

  showFade,
  children,
}: {
  rootRef: React.RefObject<HTMLDivElement | null>;
  className?: string;
  showFade: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-0 flex-1 flex-col">
      <div ref={rootRef} className={className}>
        {children}
      </div>

      {showFade && (
        <div
          aria-hidden
          className="
            pointer-events-none absolute inset-x-0 bottom-0
            h-12 bg-gradient-to-b from-transparent to-surface
          "
        />
      )}
    </div>
  );
}

export function ScrollSentinel({
  sentinelRef,
  className,
}: {
  sentinelRef: React.RefObject<HTMLDivElement | null>;
  className?: string;
}) {
  return <div ref={sentinelRef} className={cn("h-1 shrink-0", className)} />;
}
