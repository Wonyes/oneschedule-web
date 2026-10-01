import { LogIn } from "lucide-react";
import Link from "next/link";

import BrandHero from "@/src/components/common/BrandHero";
import GuestPreview from "./GuestPreview";

/**
 * 미리보기의 기준 날짜. 서버는 UTC, 브라우저는 KST라 `new Date()`를 그대로 넘기면
 * 양쪽이 다른 날을 "오늘"로 잡아 데모 일정이 하루씩 밀리고 하이드레이션이 깨진다.
 * 서울 기준 날짜만 문자열로 넘기고, 받는 쪽에서 로컬 자정으로 해석한다.
 */
function seoulDateISO() {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat("en-US", {
      timeZone: "Asia/Seoul",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    })
      .formatToParts(new Date())
      .map((p) => [p.type, p.value]),
  );
  return `${parts.year}-${parts.month}-${parts.day}`;
}

/** 비로그인 홈: 소개 + 실제 달력 미리보기 + 약관 링크 */
export default function GuestHome() {

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

      <GuestPreview todayISO={seoulDateISO()} />

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
