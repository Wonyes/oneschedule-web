"use client";

import { CalendarPlus, Check, UserRound, Users, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

import BaseCard from "@/src/components/ui/card/BaseCard";
import { Column, Row } from "@/src/components/ui/layout/flex";
import { MyInfoResponse } from "@/src/hooks/querys/useMembers";
import { useActiveGroup } from "@/src/hooks/querys/useGroup";
import { useSchedules } from "@/src/hooks/querys/useSchedule";
import { useSheetStore } from "@/src/hooks/stores/useSheetStore";

const LEGACY_DISMISS_KEY = "onboarding-dismissed";

const dismissKey = (memberNo?: number) =>
  memberNo ? `onboarding-dismissed:${memberNo}` : LEGACY_DISMISS_KEY;

const readDismissed = (memberNo?: number) => {
  const key = dismissKey(memberNo);

  if (localStorage.getItem(key) === "true") return true;

  if (memberNo && localStorage.getItem(LEGACY_DISMISS_KEY) === "true") {
    localStorage.setItem(key, "true");
    localStorage.removeItem(LEGACY_DISMISS_KEY);
    return true;
  }

  return false;
};

type Step = {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  done: boolean;
  href?: string;
  action?: () => void;
  actionLabel: string;
};

export default function OnboardingChecklist({
  user,
  today,
}: {
  user: MyInfoResponse;
  today: Date;
}) {
  const { openSheet } = useSheetStore();
  const { data: schedules, isLoading: schedulesLoading } =
    useSchedules("PERSONAL");
  const { groups, isLoading: groupsLoading } = useActiveGroup();

  const [dismissed, setDismissed] = useState<boolean | null>(null);

  useEffect(() => {
    try {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setDismissed(readDismissed(user.memberNo));
    } catch {
      setDismissed(false);
    }
  }, [user.memberNo]);

  const steps: Step[] = [
    {
      id: "schedule",
      title: "첫 일정 등록하기",
      description: "오늘 할 일이나 약속을 하나 추가해보세요.",
      icon: <CalendarPlus size={14} strokeWidth={1.75} />,
      done: (schedules ?? []).length > 0,
      action: () => openSheet({ date: today, type: "PERSONAL" }),
      actionLabel: "일정 추가",
    },
    {
      id: "group",
      title: "그룹 만들거나 참여하기",
      description: "초대 코드로 가족·팀과 일정을 공유할 수 있어요.",
      icon: <Users size={14} strokeWidth={1.75} />,
      done: groups.length > 0,
      href: "/group",
      actionLabel: "그룹으로",
    },
    {
      id: "profile",
      title: "프로필 사진 설정하기",
      description: "그룹 멤버가 나를 알아보기 쉬워져요.",
      icon: <UserRound size={14} strokeWidth={1.75} />,
      done: !!user.profileImageUrl,
      href: "/profile",
      actionLabel: "프로필로",
    },
  ];

  const doneCount = steps.filter((step) => step.done).length;
  const allDone = doneCount === steps.length;

  const undecided = dismissed === null || schedulesLoading || groupsLoading;

  if (undecided || dismissed || allDone) return null;

  const handleDismiss = () => {
    setDismissed(true);

    try {
      localStorage.setItem(dismissKey(user.memberNo), "true");
    } catch {}
  };

  const stepClass = (done: boolean) =>
    `flex h-9 items-center gap-2 rounded-xl px-3 typo-caption-2 font-medium transition-colors ${
      done
        ? "neu-pressed text-muted"
        : "neu-flat btn-spring text-foreground hover:text-accent"
    }`;

  return (
    <BaseCard className="relative px-4 py-3">
      <Row className="flex-wrap items-center gap-x-4 gap-y-2">
        <Row className="items-center gap-3">
          <span
            className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full"
            role="progressbar"
            aria-valuenow={doneCount}
            aria-valuemin={0}
            aria-valuemax={steps.length}
            aria-label="시작 가이드 진행률"
            style={{
              background: `conic-gradient(var(--accent) ${(doneCount / steps.length) * 360}deg, var(--surface-hover) 0)`,
            }}
          >
            <span className="neu-flat flex h-7 w-7 items-center justify-center rounded-full typo-caption-3 font-bold tabular-nums text-accent">
              {doneCount}/{steps.length}
            </span>
          </span>
          <Column className="gap-0">
            <span className="typo-caption-1 font-semibold text-foreground">
              시작하기
            </span>
            <span className="typo-caption-3 text-muted">
              세 가지만 하면 준비 끝이에요.
            </span>
          </Column>
        </Row>

        <Row className="flex-wrap gap-2 sm:ml-auto">
          {steps.map((step) =>
            step.done ? (
              <span key={step.id} className={stepClass(true)}>
                <Check size={14} strokeWidth={2.5} className="text-success-500" />
                <span className="line-through">{step.title}</span>
              </span>
            ) : step.href ? (
              <Link
                key={step.id}
                href={step.href}
                prefetch
                className={stepClass(false)}
              >
                <span className="text-accent">{step.icon}</span>
                {step.title}
              </Link>
            ) : (
              <button
                key={step.id}
                type="button"
                onClick={step.action}
                className={stepClass(false)}
              >
                <span className="text-accent">{step.icon}</span>
                {step.title}
              </button>
            ),
          )}
        </Row>

        <button
          type="button"
          onClick={handleDismiss}
          aria-label="시작 가이드 닫기"
          className="text-muted hover:text-foreground absolute right-3 top-3 shrink-0 rounded-lg p-1 transition-colors sm:static"
        >
          <X size={14} strokeWidth={1.75} />
        </button>
      </Row>
    </BaseCard>
  );
}
