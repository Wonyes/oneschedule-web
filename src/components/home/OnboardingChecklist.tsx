"use client";

import { CalendarPlus, Check, UserRound, Users, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import BaseCard from "@/src/components/ui/card/BaseCard";
import { Column, Row } from "@/src/components/ui/layout/flex";
import { MyInfoResponse } from "@/src/hooks/querys/useMembers";
import { useSchedules } from "@/src/hooks/querys/useSchedule";
import { useSheetStore } from "@/src/hooks/stores/useSheetStore";

const DISMISS_KEY = "onboarding-dismissed";

type Step = {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  done: boolean;
  action: () => void;
  actionLabel: string;
};

export default function OnboardingChecklist({
  user,
  today,
}: {
  user: MyInfoResponse;
  today: Date;
}) {
  const router = useRouter();
  const { openSheet } = useSheetStore();
  const { data: schedules } = useSchedules("PERSONAL");

  const [dismissed, setDismissed] = useState(true);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDismissed(localStorage.getItem(DISMISS_KEY) === "true");
  }, []);

  const steps: Step[] = [
    {
      id: "schedule",
      title: "첫 일정 등록하기",
      description: "오늘 할 일이나 약속을 하나 추가해보세요.",
      icon: <CalendarPlus size={16} strokeWidth={1.75} />,
      done: (schedules ?? []).length > 0,
      action: () => openSheet({ date: today }),
      actionLabel: "일정 추가",
    },
    {
      id: "group",
      title: "그룹 만들거나 참여하기",
      description: "초대 코드로 가족·팀과 일정을 공유할 수 있어요.",
      icon: <Users size={16} strokeWidth={1.75} />,
      done: !!user.groupCode,
      action: () => router.push("/group"),
      actionLabel: "그룹으로",
    },
    {
      id: "profile",
      title: "프로필 사진 설정하기",
      description: "그룹 멤버가 나를 알아보기 쉬워져요.",
      icon: <UserRound size={16} strokeWidth={1.75} />,
      done: !!user.imageUrl,
      action: () => router.push("/profile"),
      actionLabel: "프로필로",
    },
  ];

  const doneCount = steps.filter((step) => step.done).length;
  const allDone = doneCount === steps.length;

  if (dismissed || allDone) return null;

  const handleDismiss = () => {
    setDismissed(true);
    localStorage.setItem(DISMISS_KEY, "true");
  };

  return (
    <BaseCard className="p-5" glow>
      <Row className="mb-4 items-start justify-between gap-3">
        <Column className="gap-1">
          <span className="eyebrow">GET STARTED</span>
          <span className="typo-sub-t-1 text-foreground">
            시작을 위한 {steps.length}단계
          </span>
          <span className="typo-caption-2 text-muted">
            {doneCount}/{steps.length} 완료
          </span>
        </Column>

        <button
          type="button"
          onClick={handleDismiss}
          aria-label="시작 가이드 닫기"
          className="text-muted hover:text-foreground shrink-0 rounded-lg p-1 transition-colors"
        >
          <X size={16} strokeWidth={1.75} />
        </button>
      </Row>

      <div
        className="neu-pressed mb-4 h-1.5 w-full overflow-hidden rounded-full"
        role="progressbar"
        aria-valuenow={doneCount}
        aria-valuemin={0}
        aria-valuemax={steps.length}
        aria-label="온보딩 진행률"
      >
        <div
          className="bg-accent h-full rounded-full transition-[width] duration-500"
          style={{ width: `${(doneCount / steps.length) * 100}%` }}
        />
      </div>

      <Column className="w-full gap-2">
        {steps.map((step) => (
          <Row
            key={step.id}
            className={`neu-flat w-full gap-3 rounded-xl px-4 py-3 ${
              step.done ? "opacity-55" : ""
            }`}
          >
            <Row
              className={`h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                step.done
                  ? "bg-success-500/15 text-success-500"
                  : "neu-flat text-accent"
              }`}
            >
              {step.done ? <Check size={16} strokeWidth={2.5} /> : step.icon}
            </Row>

            <Column className="min-w-0 flex-1 gap-0.5">
              <span
                className={`typo-caption-1 font-semibold ${
                  step.done
                    ? "text-muted line-through"
                    : "text-foreground"
                }`}
              >
                {step.title}
              </span>
              <span className="typo-caption-3 text-muted truncate">
                {step.description}
              </span>
            </Column>

            {!step.done && (
              <button
                type="button"
                onClick={step.action}
                className="btn-spring text-accent hover:bg-accent/10 shrink-0 rounded-lg px-3 py-1.5 typo-caption-2 font-medium"
              >
                {step.actionLabel}
              </button>
            )}
          </Row>
        ))}
      </Column>
    </BaseCard>
  );
}
