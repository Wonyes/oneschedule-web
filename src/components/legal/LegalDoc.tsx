import Link from "next/link";

export type LegalSection = {
  title: string;
  /** 문단 문자열 또는 항목 배열(불릿) */
  body: (string | string[])[];
};

/** 약관·처리방침 공통 레이아웃. 조항은 h2 + 문단/불릿 */
export default function LegalDoc({
  title,
  effectiveDate,
  sections,
  other,
}: {
  title: string;
  effectiveDate: string;
  sections: LegalSection[];
  /** 반대편 문서 링크 */
  other: { href: string; label: string };
}) {
  return (
    <article className="neu-flat mx-auto my-6 w-full max-w-[720px] rounded-[var(--radius-outer)] px-5 py-8 sm:px-8 sm:py-10">
      <header className="mb-8">
        <span className="eyebrow">ONE SCHEDULER</span>
        <h1 className="mt-2 typo-h2 text-foreground">{title}</h1>
        <p className="mt-1 text-[13px] text-muted">시행일 {effectiveDate}</p>
      </header>

      <div className="flex flex-col gap-7">
        {sections.map((section, i) => (
          <section key={section.title}>
            <h2 className="typo-sub-t-1 text-foreground">
              제{i + 1}조 ({section.title})
            </h2>
            <div className="mt-2 flex max-w-[68ch] flex-col gap-2 text-[14px] leading-7 text-secondary">
              {section.body.map((item, j) =>
                Array.isArray(item) ? (
                  <ol key={j} className="flex list-decimal flex-col gap-1 pl-5">
                    {item.map((line) => (
                      <li key={line}>{line}</li>
                    ))}
                  </ol>
                ) : (
                  <p key={j}>{item}</p>
                ),
              )}
            </div>
          </section>
        ))}
      </div>

      <footer className="mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-divider pt-3 typo-caption-2 text-muted">
        <Link
          href={other.href}
          prefetch
          className="-mx-2 px-2 py-3 text-accent hover:underline"
        >
          {other.label} 보기
        </Link>
        <Link
          href="/login"
          prefetch
          className="-mx-2 px-2 py-3 hover:text-foreground"
        >
          돌아가기
        </Link>
      </footer>
    </article>
  );
}
