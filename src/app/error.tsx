"use client";

import { RotateCcw } from "lucide-react";
import { useEffect } from "react";

export default function AppError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("페이지 렌더링 실패:", error);
  }, [error]);

  return (
    <main className="flex h-full w-full items-center justify-center p-6">
      <div className="neu-flat flex max-w-sm flex-col items-center gap-4 rounded-[var(--radius-outer)] px-8 py-10 text-center">
        <span className="eyebrow justify-center">ERROR</span>

        <h1 className="typo-title-1 text-foreground">
          화면을 불러오지 못했어요
        </h1>

        <p className="typo-caption-2 text-muted">
          일시적인 문제일 수 있어요. 다시 시도해도 계속된다면 잠시 후 접속해
          주세요.
        </p>

        <button
          type="button"
          onClick={reset}
          className="btn-spring bg-accent text-on-primary mt-1 flex h-11 items-center gap-1.5 rounded-xl px-6 text-sm font-medium hover:bg-accent/90"
        >
          <RotateCcw size={15} strokeWidth={2} />
          다시 시도
        </button>
      </div>
    </main>
  );
}
