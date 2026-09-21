"use client";

import { Check } from "lucide-react";
import Link from "next/link";

import { cn } from "@/src/utils/cn";

export type Consent = { terms: boolean; privacy: boolean };

const ITEMS: { key: keyof Consent; label: string; href: string }[] = [
  { key: "terms", label: "이용약관", href: "/terms" },
  { key: "privacy", label: "개인정보처리방침", href: "/privacy" },
];

/** 가입 마지막 단계의 필수 동의 2개. 링크는 새 탭으로 열려 입력 중인 폼이 안 날아간다 */
export default function ConsentFields({
  value,
  error,
  onChange,
}: {
  value: Consent;
  error?: string;
  onChange: (next: Consent) => void;
}) {
  const all = value.terms && value.privacy;

  return (
    <div className="flex flex-col gap-2">
      <ConsentRow
        checked={all}
        label="전체 동의"
        strong
        onToggle={() => onChange({ terms: !all, privacy: !all })}
      />
      <div className="ml-1 flex flex-col gap-1.5 border-l border-divider pl-3">
        {ITEMS.map((item) => (
          <ConsentRow
            key={item.key}
            checked={value[item.key]}
            label={
              <>
                <span className="text-accent">[필수]</span> {item.label}
              </>
            }
            link={item.href}
            onToggle={() =>
              onChange({ ...value, [item.key]: !value[item.key] })
            }
          />
        ))}
      </div>
      {error && <p className="typo-caption-3 text-error-500">{error}</p>}
    </div>
  );
}

function ConsentRow({
  checked,
  label,
  link,
  strong = false,
  onToggle,
}: {
  checked: boolean;
  label: React.ReactNode;
  link?: string;
  strong?: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        role="checkbox"
        aria-checked={checked}
        onClick={onToggle}
        className={cn(
          "flex min-w-0 flex-1 items-center gap-2.5 rounded-lg py-1.5 text-left",
          strong
            ? "typo-caption-1 font-semibold text-foreground"
            : "typo-caption-2 text-secondary",
        )}
      >
        <span
          aria-hidden
          className={cn(
            "flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-colors",
            checked
              ? "border-accent bg-accent text-on-primary"
              : "border-divider bg-surface text-transparent",
          )}
        >
          <Check size={12} strokeWidth={3} />
        </span>
        <span className="truncate">{label}</span>
      </button>
      {link && (
        <Link
          href={link}
          target="_blank"
          rel="noopener"
          className="shrink-0 typo-caption-3 text-place-h underline-offset-2 hover:text-accent hover:underline"
        >
          보기
        </Link>
      )}
    </div>
  );
}
