"use client";

import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { Plus } from "lucide-react";
import Link from "next/link";

import OrbitRing, { OrbitItem } from "@/src/components/common/OrbitRing";
import GroupAvatar from "@/src/components/group/GroupAvatar";
import WeatherIcon from "@/src/components/schedule/components/WeatherIcon";
import { Column } from "@/src/components/ui/layout/flex";
import { useActiveGroup } from "@/src/hooks/querys/useGroup";
import { groupPath } from "@/src/lib/activeGroup";
import { MyGroupResponse } from "@/src/types/group";
import { WeatherData } from "@/src/types/schedule";

const MAX_SATELLITES = 5;

/** 홈 히어로 오른쪽: 오늘 날짜를 중심으로 내 그룹들이 도는 오빗 */
export default function HomeOrbit({
  today,
  weather,
  initialGroups,
  activeGroup,
}: {
  today: Date;
  weather?: WeatherData;
  initialGroups?: MyGroupResponse[];
  activeGroup?: MyGroupResponse;
}) {
  const { groups } = useActiveGroup(true, initialGroups);

  // 활성 그룹을 맨 앞에
  const ordered = activeGroup
    ? [
        activeGroup,
        ...groups.filter((g) => g.groupNo !== activeGroup.groupNo),
      ]
    : groups;
  const shown = ordered.slice(0, MAX_SATELLITES);
  const hidden = ordered.length - shown.length;

  const items: OrbitItem[] = shown.map((group) => ({
    key: group.groupNo,
    node: (
      <Link
        href={groupPath(group)}
        prefetch
        title={group.groupName}
        className="block btn-spring hover:scale-110"
      >
        <GroupAvatar
          name={group.groupName}
          imageUrl={group.profileImageUrl}
          className="h-8 w-8 rounded-full ring-2 ring-[var(--surface)]"
        />
      </Link>
    ),
  }));

  if (hidden > 0) {
    items.push({
      key: "more",
      node: (
        <Link
          href="/group"
          prefetch
          aria-label={`그룹 ${hidden}개 더 보기`}
          className="neu-flat flex h-8 w-8 items-center justify-center rounded-full typo-caption-3 font-semibold text-muted btn-spring hover:scale-110"
        >
          +{hidden}
        </Link>
      ),
    });
  }

  if (items.length === 0) {
    items.push({
      key: "join",
      node: (
        <Link
          href="/group"
          prefetch
          aria-label="그룹 만들거나 참여하기"
          className="neu-flat flex h-8 w-8 items-center justify-center rounded-full text-accent btn-spring hover:scale-110"
        >
          <Plus size={14} strokeWidth={2.25} />
        </Link>
      ),
    });
  }

  return (
    <OrbitRing
      radius={78}
      items={items}
      className="hidden h-52 w-52 lg:flex"
      center={
        <Column className="neu-float h-[92px] w-[92px] items-center justify-center gap-0 rounded-full ring-4 ring-[var(--surface)]">
          <span className="typo-h4 leading-none font-bold tabular-nums text-foreground">
            {format(today, "d")}
          </span>
          <span className="mt-1 typo-caption-3 text-place-h">
            {format(today, "M월 · EEE", { locale: ko })}
          </span>
          {weather && (
            <span className="mt-1 flex items-center gap-1 typo-caption-3 text-accent">
              <WeatherIcon pty={weather.PTY} sky={weather.SKY} size={12} />
              {weather.TMP}°
            </span>
          )}
        </Column>
      }
    />
  );
}
