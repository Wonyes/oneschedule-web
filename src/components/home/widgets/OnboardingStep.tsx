import { Check } from "lucide-react";
import Link from "next/link";

import { cn } from "@/src/utils/cn";

export type Step = {
  id: string;
  title: string;
  icon: React.ReactNode;
  done: boolean;
  /** 둘 중 하나: 링크로 가거나 액션을 실행하거나 */
  href?: string;
  action?: () => void;
};

const base =
  "flex h-9 items-center gap-2 rounded-xl px-3 typo-caption-2 font-medium transition-colors";

/** 시작 가이드 알약 하나. 끝났으면 취소선, 아니면 링크/버튼 */
export default function OnboardingStep({ step }: { step: Step }) {
  if (step.done) {
    return (
      <span className={cn(base, "neu-pressed text-muted")}>
        <Check size={14} strokeWidth={2.5} className="text-success-500" />
        <span className="line-through">{step.title}</span>
      </span>
    );
  }

  const className = cn(
    base,
    "neu-flat btn-spring text-foreground hover:text-accent",
  );
  const inner = (
    <>
      <span className="text-accent">{step.icon}</span>
      {step.title}
    </>
  );

  return step.href ? (
    <Link href={step.href} prefetch className={className}>
      {inner}
    </Link>
  ) : (
    <button type="button" onClick={step.action} className={className}>
      {inner}
    </button>
  );
}
