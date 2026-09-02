import Link from "next/link";
import { Home } from "lucide-react";

export default function NotFound() {
  return (
    <main className="flex h-full w-full items-center justify-center p-6">
      <div className="neu-flat flex max-w-sm flex-col items-center gap-4 rounded-[var(--radius-outer)] px-8 py-10 text-center">
        <span className="eyebrow justify-center">404</span>

        <h1 className="typo-title-1 text-foreground">
          찾을 수 없는 페이지예요
        </h1>

        <p className="typo-caption-2 text-muted">
          주소가 바뀌었거나 삭제된 페이지일 수 있어요.
        </p>

        <Link
          href="/"
          className="btn-spring bg-accent text-on-primary mt-1 flex h-11 items-center gap-1.5 rounded-xl px-6 text-sm font-medium hover:bg-accent/90"
        >
          <Home size={15} strokeWidth={2} />
          홈으로 가기
        </Link>
      </div>
    </main>
  );
}
