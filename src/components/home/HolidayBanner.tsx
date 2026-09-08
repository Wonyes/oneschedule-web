"use client";

import { differenceInCalendarDays } from "date-fns";
import { useMemo } from "react";

import BaseCard from "@/src/components/ui/card/BaseCard";
import { Row, Between } from "@/src/components/ui/layout/flex";
import Skeleton from "@/src/components/ui/Skeleton";
import { useHolidays } from "@/src/hooks/querys/useCommonApi";

export default function HolidayBanner({ today }: { today: Date }) {
  const { data: holidays, isPending } = useHolidays();

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

  /*
    공휴일이 오기 전에는 자리만 잡아둔다.
    바로 null을 돌려주면 배너가 없다가 갑자기 끼어들면서 아래 카드들이 밀린다.
  */
  if (isPending) {
    return (
      <BaseCard className="p-4">
        <Between>
          <Row className="gap-2">
            <Skeleton className="h-3.5 w-24 rounded" />
            <Skeleton className="h-3.5 w-16 rounded" />
          </Row>
          <Skeleton className="h-3.5 w-10 rounded" />
        </Between>
      </BaseCard>
    );
  }

  // 다가오는 공휴일이 정말 없을 때만 자리를 비운다
  if (!upcomingHoliday) return null;

  const dDay = differenceInCalendarDays(upcomingHoliday.date, today);

  return (
    <BaseCard className="p-4">
      <Between>
        <Row className="gap-2">
          <span className="typo-caption-2 text-place-h">다가오는 공휴일</span>
          <span className="typo-caption-2 font-semibold text-foreground">
            {upcomingHoliday.dateName}
          </span>
        </Row>
        <span className="typo-caption-2 font-bold text-accent">
          {dDay === 0 ? "D-DAY" : `D-${dDay}`}
        </span>
      </Between>
    </BaseCard>
  );
}
