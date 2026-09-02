import { LogIn } from "lucide-react";

export default function GuestHome() {
  return (
    <div className="neu-flat rounded-[var(--radius-outer)] p-8">
      <div className="flex flex-col items-center gap-4 py-6 text-center">
        <span className="eyebrow">HOME</span>
        <div>
          <h1 className="typo-title-1 text-foreground">
            로그인하고 시작하세요
          </h1>
          <p className="mt-1.5 typo-caption-2 text-muted">
            내 일정과 그룹 일정을 한눈에 보려면 로그인이 필요해요.
          </p>
        </div>
        <a
          href="/login"
          className="btn-spring bg-accent text-on-primary flex h-10 items-center gap-1.5 rounded-xl px-5 text-sm font-medium shadow-lg shadow-accent/25 hover:bg-accent/90"
        >
          <LogIn size={15} strokeWidth={2} />
          로그인
        </a>
      </div>
    </div>
  );
}
