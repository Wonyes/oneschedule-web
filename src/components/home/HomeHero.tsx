"use client";

import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { CalendarDays, Plus } from "lucide-react";
import Link from "next/link";

import BaseCard from "@/src/components/ui/card/BaseCard";
import { Primary } from "@/src/components/ui/layout/button";
import { Column, Row } from "@/src/components/ui/layout/flex";
import { MyInfoResponse } from "@/src/hooks/querys/useMembers";
import { useWeathers } from "@/src/hooks/querys/useCommonApi";
import { useSheetStore } from "@/src/hooks/stores/useSheetStore";
import WeatherIcon from "@/src/components/schedule/components/WeatherIcon";
import { MyGroupResponse } from "@/src/types/group";
import HomeOrbit from "./HomeOrbit";
import HomeStats from "./HomeStats";
import WeekStrip from "./WeekStrip";

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

export default function HomeHero({
  user,
  today,
  initialGroups,
  activeGroup,
}: {
  user: MyInfoResponse;
  today: Date;
  initialGroups?: MyGroupResponse[];
  activeGroup?: MyGroupResponse;
}) {
  const { openSheet } = useSheetStore();
  const { data: weathers } = useWeathers();

  const todayWeather = weathers?.[format(today, "yyyyMMdd")];

  return (
    <BaseCard glow className="p-6 lg:p-8">
      <div className="grid items-center gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)_auto] lg:gap-10">
        <Column className="min-w-0 gap-5">
          <Column>
            <span className="eyebrow mb-1.5">HOME</span>
            <h1 className="typo-title-1 text-foreground">
              안녕하세요, {user.nickname}님
            </h1>
            <p className="mt-1.5 typo-caption-2 text-muted">
              {format(today, "yyyy년 M월 d일 EEEE", { locale: ko })}
              {todayWeather && (
                <>
                  {" · "}
                  {getWeatherPhrase(
                    Number(todayWeather.TMP),
                    todayWeather.PTY,
                  )}{" "}
                  <WeatherIcon
                    pty={todayWeather.PTY}
                    sky={todayWeather.SKY}
                    size={14}
                    className="inline-block align-[-2px]"
                  />{" "}
                  {todayWeather.TMP}°
                </>
              )}
            </p>
          </Column>

          <Row className="flex-wrap gap-2">
            <Primary
              text="일정 추가"
              icon={<Plus size={15} strokeWidth={2} />}
              onClick={() => openSheet({ date: today, type: "PERSONAL" })}
              className="h-10 px-4"
            />
            <Link
              href="/schedule"
              prefetch
              className="neu-btn btn-spring flex h-10 items-center gap-1.5 rounded-xl px-4 typo-caption-2 font-medium text-secondary hover:text-foreground"
            >
              <CalendarDays size={15} strokeWidth={1.75} />
              캘린더 열기
            </Link>
          </Row>

          <HomeStats initialGroups={initialGroups} activeGroup={activeGroup} />
        </Column>

        <WeekStrip today={today} />

        <HomeOrbit
          today={today}
          weather={todayWeather}
          initialGroups={initialGroups}
          activeGroup={activeGroup}
        />
      </div>
    </BaseCard>
  );
}
