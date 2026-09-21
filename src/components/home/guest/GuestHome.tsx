import { LogIn } from "lucide-react";
import Link from "next/link";

import BrandHero from "@/src/components/common/BrandHero";
import GuestPreview from "./GuestPreview";

/** 비로그인 홈: 소개 + 실제 달력 미리보기 + 약관 링크 */
export default function GuestHome() {
  const today = new Date();

  return (
    <div className="flex w-full flex-col gap-5">
      <div className="neu-flat rounded-[var(--radius-outer)] px-6 py-10 sm:py-12">
        <div className="mx-auto flex max-w-sm flex-col items-center gap-5 text-center">
          <BrandHero />

          <div>
            <span className="eyebrow mb-2 justify-center">ONE SCHEDULER</span>
            <h1 className="text-balance typo-title-1 text-foreground">
              팀의 일정을
              <br />
              한눈에.
            </h1>
            <p className="mt-2 typo-caption-2 text-muted">
              개인 일정과 그룹 일정을 함께 보고, 비는 시간을 찾으세요.
            </p>
          </div>

          <Link
            href="/login"
            prefetch
            className="btn-primary btn-spring flex h-11 items-center gap-1.5 rounded-xl px-6 text-sm font-medium"
          >
            <LogIn size={15} strokeWidth={2} />
            시작하기
          </Link>
        </div>
      </div>

      <GuestPreview today={today} />

      <p className="flex items-center justify-center gap-1 typo-caption-3 text-place-h">
        <Link
          href="/terms"
          prefetch
          className="px-2 py-3 hover:text-foreground"
        >
          이용약관
        </Link>
        <span aria-hidden>·</span>
        <Link
          href="/privacy"
          prefetch
          className="px-2 py-3 hover:text-foreground"
        >
          개인정보처리방침
        </Link>
      </p>
    </div>
  );
}
