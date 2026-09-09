import { LogIn } from "lucide-react";

import BrandHero from "@/src/components/common/BrandHero";

export default function GuestHome() {
  return (
    <div className="neu-flat rounded-[var(--radius-outer)] px-6 py-10 sm:py-14">
      <div className="mx-auto flex max-w-sm flex-col items-center gap-5 text-center">
        <BrandHero />

        <div>
          <span className="eyebrow mb-2 justify-center">ONE SCHEDULER</span>
          <h1 className="typo-title-1 text-foreground text-balance">
            나와 우리 팀의 일정을
            <br />한 곳에서 관리하세요
          </h1>
          <p className="mt-2 typo-caption-2 text-muted">
            개인 일정과 그룹 일정을 함께 보고, 겹치는 시간도 한눈에 확인해요.
          </p>
        </div>

        <a
          href="/login"
          className="btn-spring bg-accent text-on-primary flex h-11 items-center gap-1.5 rounded-xl px-6 text-sm font-medium shadow-lg shadow-accent/25 hover:bg-accent/90"
        >
          <LogIn size={15} strokeWidth={2} />
          로그인하고 시작하기
        </a>
      </div>
    </div>
  );
}
