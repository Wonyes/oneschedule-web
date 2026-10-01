"use client";

import { format, isSameDay, isToday, startOfDay } from "date-fns";
import { ko } from "date-fns/locale";
import Link from "next/link";
import { useMemo } from "react";

import { Column, Row } from "@/src/components/ui/layout/flex";
import WeatherIcon from "@/src/components/common/weather/WeatherIcon";
import { EVENT_STYLES } from "@/src/constant/schedule";
import { useWeathers } from "@/src/hooks/querys/useCommonApi";
import { useActiveGroup } from "@/src/hooks/querys/useGroup";
import { useSchedules } from "@/src/hooks/querys/useSchedule";
import { getWeekDates, toScheduleEvent } from "@/src/utils/schedule";
import { cn } from "@/src/utils/cn";

const MAX_DOTS = 3;

/** 히어로 가운데: 이번 주 7일 타일 + 일정 점. 누르면 그 날 일 뷰로 */
export default function WeekStrip({ today }: { today: Date }) {
  const { group } = useActiveGroup();
  const { data: weathers } = useWeathers();
  const { data: personal } = useSchedules("PERSONAL", true);
  const { data: groupSchedules } = useSchedules("GROUP", true, group?.groupNo);

  const week = useMemo(() => getWeekDates(today), [today]);

  const byDay = useMemo(() => {
    const events = [...(personal ?? []), ...(groupSchedules ?? [])].map(
      toScheduleEvent,
    );
    return week.map((date) =>
      events.filter((e) => isSameDay(startOfDay(new Date(e.startDate)), date)),
    );
  }, [personal, groupSchedules, week]);

  return (
    <Column className="w-full min-w-0 gap-2.5">
      <Row className="items-baseline gap-1.5 px-0.5">
        <span className="typo-caption-1 font-semibold text-foreground">
          이번 주
        </span>
        <span className="typo-caption-3 text-place-h">
          {format(week[0], "M월 d일")} – {format(week[6], "M월 d일")}
        </span>
      </Row>

      <Row className="w-full gap-1.5">
        {week.map((date, i) => {
          const events = byDay[i];
          const current = isToday(date);
          const day = date.getDay();
          const weather = weathers?.[format(date, "yyyyMMdd")];

          return (
            <Link
              key={date.getTime()}
              href={`/schedule?view=day&date=${format(date, "yyyy-MM-dd")}`}
              prefetch
              aria-label={`${format(date, "M월 d일 EEEE", { locale: ko })}, 일정 ${events.length}개`}
              className={cn(
                "btn-spring flex min-w-0 flex-1 flex-col items-center gap-1 rounded-xl py-2.5",
                current
                  ? "btn-primary"
                  : "neu-flat text-foreground hover:text-accent",
              )}
            >
              <span
                className={cn(
                  "typo-caption-3",
                  current
                    ? "text-on-primary/80"
                    : day === 0
                      ? "text-error-500"
                      : day === 6
                        ? "text-blue"
                        : "text-place-h",
                )}
              >
                {format(date, "EEE", { locale: ko })}
              </span>
              <span className="typo-sub-t-2 leading-none tabular-nums">
                {format(date, "d")}
              </span>
              <span
                className={cn(
                  "flex h-4 items-center gap-0.5 typo-caption-3 tabular-nums",
                  current ? "text-on-primary/80" : "text-place-h",
                )}
              >
                {weather && (
                  <>
                    <WeatherIcon
                      pty={weather.PTY}
                      sky={weather.SKY}
                      size={11}
                    />
                    {weather.TMP}°
                  </>
                )}
              </span>
              <Row className="h-1.5 items-center gap-0.5">
                {events.slice(0, MAX_DOTS).map((e) => (
                  <span
                    key={e.id}
                    className={cn(
                      "h-1.5 w-1.5 rounded-full",
                      current
                        ? "bg-on-primary/80"
                        : (EVENT_STYLES[e.category as keyof typeof EVENT_STYLES]
                            ?.dot ?? "bg-accent"),
                    )}
                  />
                ))}
              </Row>
            </Link>
          );
        })}
      </Row>
    </Column>
  );
}
