"use client";

import { cn } from "@/src/utils/cn";

/**
 * 스크롤되는 목록 영역.
 *
 * 아래쪽에 그라데이션을 깔아 "여기서 끝이 아니다"를 알린다. 목록 끝에 미리보기
 * 줄을 넣는 방법도 있지만 그건 이미 스크롤을 내려야 보여서 신호 역할을 못 한다.
 * 잘린 줄 위에 흐림이 겹쳐야 첫 화면에서 바로 읽힌다.
 */
export default function ScrollListArea({
  rootRef,
  className,

  showFade,
  children,
}: {
  rootRef: React.RefObject<HTMLDivElement | null>;
  className?: string;
  /** 아직 더 볼 게 남았을 때만 흐리게 한다 */
  showFade: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="relative">
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

/** 관찰자가 노리는 지점. 목록의 마지막 자식으로 둔다. */
export function ScrollSentinel({
  sentinelRef,
  className,
}: {
  sentinelRef: React.RefObject<HTMLDivElement | null>;
  className?: string;
}) {
  return <div ref={sentinelRef} className={cn("h-1 shrink-0", className)} />;
}
