"use client";

import { format } from "date-fns";
import { Plus } from "lucide-react";

import BaseCard from "@/src/components/ui/card/BaseCard";
import { Primary } from "@/src/components/ui/layout/button";
import { Column, Between } from "@/src/components/ui/layout/flex";
import { MyInfoResponse } from "@/src/hooks/querys/useMembers";
import { useWeathers } from "@/src/hooks/querys/useCommonApi";
import { useSheetStore } from "@/src/hooks/stores/useSheetStore";
import { getWeatherIcon } from "@/src/utils/schedule";

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
}: {
  user: MyInfoResponse;
  today: Date;
}) {
  const { openSheet } = useSheetStore();
  const { data: weathers } = useWeathers();

  const todayWeather = weathers?.[format(today, "yyyyMMdd")];

  return (
    <BaseCard glow className="p-6">
      <Between className="flex-col items-start gap-4 sm:flex-row sm:items-center">
        <Column>
          <span className="eyebrow mb-1.5">HOME</span>
          <h1 className="typo-title-1 text-foreground">
            안녕하세요, {user.nickname}님
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
  );
}
