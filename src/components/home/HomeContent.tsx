"use client";

import { differenceInCalendarDays, format, startOfDay } from "date-fns";
import { ArrowRight, CalendarDays, LogIn, Plus, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import React from "react";

import BaseCard from "@/src/components/ui/card/BaseCard";
import { Primary } from "@/src/components/ui/layout/button";
import { Column, Row, Between } from "@/src/components/ui/layout/flex";
import ScheduleCard from "@/src/components/schedule/components/ScheduleCard";
import { useMyInfo } from "@/src/hooks/querys/useMembers";
import { useMyGroup } from "@/src/hooks/querys/useGroup";
import { useHolidays, useWeathers } from "@/src/hooks/querys/useCommonApi";
import { useSheetStore } from "@/src/hooks/stores/useSheetStore";
import { useSchedules } from "@/src/hooks/querys/useSchedule";
import { getWeatherIcon, toScheduleEvent } from "@/src/utils/schedule";

function getWeatherPhrase(tmp: number, pty: string) {
  if (pty !== "0") {
    if (pty === "3") return "오늘은 눈이 와요, 포근하게 입으세요";
    return "오늘은 비 소식이 있어요, 우산 챙기세요";
  }
  if (tmp >= 30) return "오늘은 날씨가 무척 더워요";
  if (tmp >= 23) return "오늘은 날씨가 따뜻해요";
  if (tmp >= 15) return "오늘은 선선한 날씨예요";
  if (tmp >= 5) return "오늘은 쌀쌀해요, 겉옷 챙기세요";
  return "오늘은 많이 추워요";
}

export default function HomeContent() {
  const router = useRouter();
  const { openSheet } = useSheetStore();

  const { data: user, isLoading: userLoading, isError: userError } =
    useMyInfo();
  const { data: group, isLoading: groupLoading } = useMyGroup(
    !!user?.groupCode,
  );
  const { data: weathers } = useWeathers();
  const { data: holidays } = useHolidays();
  const { data: schedules } = useSchedules("PERSONAL", !!user);

  const events = useMemo(
    () => (schedules ?? []).map(toScheduleEvent),
    [schedules],
  );

  const today = useMemo(() => new Date(), []);

  const upcomingHoliday = useMemo(() => {
    if (!holidays?.length) return null;

    return holidays
      .map((h) => {
        const s = h.locdate.toString();
        return {
          ...h,
          date: new Date(
            Number(s.slice(0, 4)),
            Number(s.slice(4, 6)) - 1,
            Number(s.slice(6, 8)),
          ),
        };
      })
      .filter((h) => differenceInCalendarDays(h.date, today) >= 0)
      .sort((a, b) => a.date.getTime() - b.date.getTime())[0];
  }, [holidays, today]);

  const todayWeather = weathers?.[format(today, "yyyyMMdd")];

  const upcomingEvents = useMemo(() => {
    const start = startOfDay(today).getTime();

    return [...events]
      .filter((e) => new Date(e.startDate).getTime() >= start)
      .sort(
        (a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime(),
      )
      .slice(0, 3);
  }, [events, today]);

  if (userLoading || (groupLoading && !!user)) {
    return (
      <div className="flex w-full flex-col gap-4">
        <div className="h-[104px] rounded-[var(--radius-outer)] neu-flat animate-pulse" />
        <div className="h-[180px] rounded-[var(--radius-outer)] neu-flat animate-pulse" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="h-[80px] rounded-[var(--radius-outer)] neu-flat animate-pulse" />
          <div className="h-[80px] rounded-[var(--radius-outer)] neu-flat animate-pulse" />
        </div>
      </div>
    );
  }

  if (userError || !user) {
    return (
      <BaseCard glow className="p-8">
        <Column className="items-center gap-4 py-6 text-center">
          <span className="eyebrow">HOME</span>
          <div>
            <h1 className="typo-title-1 text-foreground">
              로그인하고 시작하세요
            </h1>
            <p className="mt-1.5 typo-caption-2 text-muted">
              내 일정과 그룹 일정을 한눈에 보려면 로그인이 필요해요.
            </p>
          </div>
          <Primary
            text="로그인"
            icon={<LogIn size={15} strokeWidth={2} />}
            onClick={() => router.push("/login")}
            className="h-10 px-5"
          />
        </Column>
      </BaseCard>
    );
  }

  const dDay = upcomingHoliday
    ? differenceInCalendarDays(upcomingHoliday.date, today)
    : null;

  return (
    <div className="scroll-stable flex w-full flex-col gap-4 overflow-y-auto">
      <BaseCard glow className="p-6">
        <Between className="flex-col items-start gap-4 sm:flex-row sm:items-center">
          <Column>
            <span className="eyebrow mb-1.5">HOME</span>
            <h1 className="typo-title-1 text-foreground">
              안녕하세요, {user?.nickname ?? "회원"}님
            </h1>
            <p className="mt-1.5 typo-caption-2 text-muted">
              {format(today, "yyyy년 M월 d일 EEEE")}
              {todayWeather && (
                <>
                  {" · "}
                  {getWeatherPhrase(Number(todayWeather.TMP), todayWeather.PTY)}{" "}
                  {getWeatherIcon(todayWeather.PTY, todayWeather.SKY)}{" "}
                  {todayWeather.TMP}°
                </>
              )}
            </p>
          </Column>

          <Primary
            text="일정 추가"
            icon={<Plus size={15} strokeWidth={2} />}
            onClick={() => openSheet({ date: today })}
            className="h-10 shrink-0 px-4"
          />
        </Between>
      </BaseCard>

      {upcomingHoliday && (
        <BaseCard className="p-4">
          <Between>
            <Row className="gap-2">
              <span className="typo-caption-2 text-place-h">
                다가오는 공휴일
              </span>
              <span className="typo-caption-2 font-semibold text-foreground">
                {upcomingHoliday.dateName}
              </span>
            </Row>
            <span className="typo-caption-2 font-bold text-accent">
              {dDay === 0 ? "D-DAY" : `D-${dDay}`}
            </span>
          </Between>
        </BaseCard>
      )}

      <BaseCard className="p-5">
        <Between className="mb-3">
          <Column className="gap-1">
            <span className="eyebrow">SCHEDULE</span>
            <span className="typo-sub-t-1 text-foreground">다가오는 일정</span>
          </Column>

          <button
            onClick={() => router.push("/schedule")}
            className="typo-caption-2 text-accent hover:underline"
          >
            전체 보기
          </button>
        </Between>

        {upcomingEvents.length === 0 ? (
          <p className="py-6 text-center typo-caption-2 text-muted">
            다가오는 일정이 없습니다.
          </p>
        ) : (
          <Column className="gap-2">
            {upcomingEvents.map((event) => (
              <ScheduleCard
                key={event.id}
                event={event}
                date={new Date(event.startDate)}
                variant="agenda"
                onClick={() => openSheet({ event })}
              />
            ))}
          </Column>
        )}
      </BaseCard>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <QuickLink
          icon={<CalendarDays size={18} strokeWidth={1.5} />}
          title="캘린더"
          description="내 일정과 그룹 일정을 확인하세요"
          onClick={() => router.push("/schedule")}
        />

        <BaseCard glow className="p-5">
          <button
            onClick={() => router.push("/group")}
            className="group flex w-full items-center justify-between gap-4 text-left"
          >
            <Row className="gap-3">
              <Row className="h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent">
                <Users size={18} strokeWidth={1.5} />
              </Row>

              <Column className="gap-1">
                <span className="typo-sub-t-2 text-foreground">그룹</span>

                {group ? (
                  <Row className="items-center gap-2">
                    <Row className="-space-x-1.5">
                      {group.members.slice(0, 4).map((m) => (
                        <span
                          key={m.memberNo}
                          className="ring-surface flex h-5 w-5 items-center justify-center rounded-full bg-accent/20 text-[9px] font-bold text-accent ring-2"
                        >
                          {m.nickname[0]}
                        </span>
                      ))}
                    </Row>
                    <span className="typo-caption-2 text-muted">
                      {group.groupName}
                    </span>
                  </Row>
                ) : (
                  <span className="typo-caption-2 text-muted">
                    그룹을 만들거나 참여해보세요
                  </span>
                )}
              </Column>
            </Row>

            <ArrowRight
              size={16}
              strokeWidth={1.75}
              className="shrink-0 text-muted transition-transform group-hover:translate-x-0.5"
            />
          </button>
        </BaseCard>
      </div>
    </div>
  );
}

function QuickLink({
  icon,
  title,
  description,
  onClick,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick: () => void;
}) {
  return (
    <BaseCard glow className="p-5">
      <button
        onClick={onClick}
        className="group flex w-full items-center justify-between gap-4 text-left"
      >
        <Row className="gap-3">
          <Row className="h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent">
            {icon}
          </Row>

          <Column className="gap-0.5">
            <span className="typo-sub-t-2 text-foreground">{title}</span>
            <span className="typo-caption-2 text-muted">{description}</span>
          </Column>
        </Row>

        <ArrowRight
          size={16}
          strokeWidth={1.75}
          className="shrink-0 text-muted transition-transform group-hover:translate-x-0.5"
        />
      </button>
    </BaseCard>
  );
}
