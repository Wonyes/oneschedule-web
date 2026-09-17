"use client";

import { CalendarPlus, UserRound, Users, X } from "lucide-react";

import BaseCard from "@/src/components/ui/card/BaseCard";
import { Column, Row } from "@/src/components/ui/layout/flex";
import { useActiveGroup } from "@/src/hooks/querys/useGroup";
import { MyInfoResponse } from "@/src/hooks/querys/useMembers";
import { useSchedules } from "@/src/hooks/querys/useSchedule";
import { useSheetStore } from "@/src/hooks/stores/useSheetStore";
import OnboardingStep, { Step } from "./OnboardingStep";
import {
  dismissOnboarding,
  useOnboardingDismissed,
} from "./useOnboardingDismissed";

/** 홈 상단 시작 가이드. 세 단계 다 끝나거나 닫으면 안 보인다 */
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
  const dismissed = useOnboardingDismissed(user.memberNo);

  const steps: Step[] = [
    {
      id: "schedule",
      title: "첫 일정 등록하기",
      icon: <CalendarPlus size={14} strokeWidth={1.75} />,
      done: (schedules ?? []).length > 0,
      action: () => openSheet({ date: today, type: "PERSONAL" }),
    },
    {
      id: "group",
      title: "그룹 만들거나 참여하기",
      icon: <Users size={14} strokeWidth={1.75} />,
      done: groups.length > 0,
      href: "/group",
    },
    {
      id: "profile",
      title: "프로필 사진 설정하기",
      icon: <UserRound size={14} strokeWidth={1.75} />,
      done: !!user.profileImageUrl,
      href: "/profile",
    },
  ];

  const doneCount = steps.filter((step) => step.done).length;
  const undecided = dismissed === null || schedulesLoading || groupsLoading;

  if (undecided || dismissed || doneCount === steps.length) return null;

  return (
    <BaseCard className="relative px-4 py-3">
      <Row className="flex-wrap items-center gap-x-4 gap-y-2">
        <Row className="items-center gap-3">
          <span
            role="progressbar"
            aria-valuenow={doneCount}
            aria-valuemin={0}
            aria-valuemax={steps.length}
            aria-label="시작 가이드 진행률"
            className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full"
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
          {steps.map((step) => (
            <OnboardingStep key={step.id} step={step} />
          ))}
        </Row>

        <button
          type="button"
          onClick={() => dismissOnboarding(user.memberNo)}
          aria-label="시작 가이드 닫기"
          className="absolute right-2 top-2 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-muted transition-colors hover:text-foreground sm:static"
        >
          <X size={14} strokeWidth={1.75} />
        </button>
      </Row>
    </BaseCard>
  );
}
