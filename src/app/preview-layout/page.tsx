"use client";

import { useState } from "react";
import {
  Activity,
  CalendarDays,
  Copy,
  Crown,
  MoreVertical,
  Plus,
  Settings,
  Shield,
  UserPlus,
  Users,
} from "lucide-react";

import BaseCard from "@/src/components/ui/card/BaseCard";
import { Column, Row } from "@/src/components/ui/layout/flex";
import SegmentedTabs from "@/src/components/ui/layout/SegmentedTabs";
import VisibilityBadge from "@/src/components/group/VisibilityBadge";

const MEMBERS = [
  { n: "wontwo", p: "왕", role: "SUPER", on: true, ago: "온라인" },
  { n: "wony", p: "부왕", role: "SUB", on: false, ago: "6시간 전" },
  { n: "김서준", p: "", role: "MEMBER", on: true, ago: "온라인" },
  { n: "이하은", p: "디자인", role: "MEMBER", on: false, ago: "어제" },
  { n: "박민준", p: "", role: "MEMBER", on: false, ago: "3일 전" },
  { n: "최지우", p: "개발", role: "MEMBER", on: false, ago: "5일 전" },
  { n: "정우진", p: "", role: "MEMBER", on: false, ago: "2주 전" },
];

const TODAY = [
  { t: "10:00 – 11:00", title: "주간 싱크", by: "wontwo" },
  { t: "14:00 – 15:30", title: "디자인 리뷰", by: "이하은" },
];
const UPCOMING = [
  { d: "내일", t: "19:00", title: "저녁 회식", by: "wony" },
  { d: "목", t: "13:00", title: "배포 점검", by: "최지우" },
  { d: "토", t: "11:00", title: "주말 게임", by: "wontwo" },
];

function Chip({ label, value }: { label: string; value: string }) {
  return (
    <Row className="neu-pressed h-8 gap-1.5 rounded-lg px-3">
      <span className="typo-caption-3 text-place-h">{label}</span>
      <span className="typo-caption-2 font-semibold tabular-nums text-foreground">
        {value}
      </span>
    </Row>
  );
}

function Avatar({ name, on, size = 9 }: { name: string; on?: boolean; size?: number }) {
  return (
    <span className="relative shrink-0">
      <span
        className={`neu-flat flex items-center justify-center rounded-full typo-caption-3 font-bold text-accent h-${size} w-${size}`}
      >
        {name[0]}
      </span>
      {on !== undefined && (
        <span
          className={`absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full ring-2 ring-[var(--surface)] ${on ? "bg-success-500" : "bg-place-h"}`}
        />
      )}
    </span>
  );
}

function ScheduleRow({ t, title, by, d }: { t: string; title: string; by: string; d?: string }) {
  return (
    <Row className="neu-flat w-full min-w-0 gap-3 rounded-lg px-3 py-2.5">
      <Column className="w-[86px] shrink-0 gap-0">
        {d && <span className="typo-caption-3 text-accent">{d}</span>}
        <span className="typo-caption-3 tabular-nums text-place-h">{t}</span>
      </Column>
      <span className="min-w-0 flex-1 truncate typo-caption-2 font-medium text-foreground">
        {title}
      </span>
      <span className="shrink-0 typo-caption-3 text-place-h">{by}</span>
    </Row>
  );
}

function Hero() {
  return (
    <BaseCard glow className="relative overflow-hidden p-5 sm:p-6">
      <div aria-hidden className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full bg-accent/15 blur-3xl" />
      <div className="relative flex flex-col gap-5">
        <div className="flex items-start gap-4">
          <div className="neu-float flex h-16 w-16 shrink-0 items-center justify-center rounded-[22px] typo-title-1 font-bold text-accent sm:h-[72px] sm:w-[72px]">W</div>
          <Column className="min-w-0 flex-1 gap-1.5">
            <Row className="flex-wrap gap-1.5">
              <span className="eyebrow">GROUP</span>
              <VisibilityBadge visibility="PUBLIC_APPROVAL" />
              <Row className="neu-flat h-6 gap-1 rounded-full px-2.5">
                <Crown size={12} strokeWidth={2} className="text-pending-500" />
                <span className="typo-caption-3 font-semibold text-pending-500">관리자</span>
              </Row>
            </Row>
            <h1 className="typo-title-1 truncate text-foreground">wony house</h1>
            <p className="typo-caption-1 leading-relaxed text-secondary">주말마다 모여서 밥 먹고 게임하는 집. 일정 겹치면 여기서 맞춰요.</p>
          </Column>
        </div>
        <div className="flex flex-col gap-3 border-t border-divider pt-4 sm:flex-row sm:items-center sm:justify-between">
          <Row className="flex-wrap gap-2">
            <Chip label="멤버" value="7" />
            <Chip label="오늘" value="2" />
            <Chip label="이번 주" value="5" />
            <Row className="neu-pressed h-8 gap-2 rounded-lg pl-3 pr-1.5">
              <span className="typo-caption-3 text-place-h">초대 코드</span>
              <span className="typo-caption-2 font-semibold tabular-nums text-foreground">WNY-4K2P</span>
              <span className="neu-btn flex h-6 w-6 items-center justify-center rounded-md text-muted"><Copy size={12} /></span>
            </Row>
          </Row>
          <span className="typo-caption-2 text-place-h">그룹 해체</span>
        </div>
      </div>
    </BaseCard>
  );
}

function ScheduleCard() {
  return (
    <BaseCard className="flex flex-col gap-4 p-5">
      <Row className="justify-between">
        <Column className="gap-0.5">
          <span className="eyebrow">SCHEDULE</span>
          <h2 className="typo-sub-t-1 text-foreground">그룹 일정</h2>
        </Column>
        <span className="btn-primary flex h-9 items-center gap-1.5 rounded-xl px-3.5 typo-caption-2 font-semibold">
          <Plus size={14} strokeWidth={2.25} /> 일정 추가
        </span>
      </Row>
      <Column className="w-full gap-2">
        <Row className="gap-2"><span className="typo-caption-2 font-semibold text-foreground">오늘</span><span className="typo-caption-3 text-place-h">9월 11일 목</span></Row>
        {TODAY.map((s) => <ScheduleRow key={s.title} {...s} />)}
      </Column>
      <Column className="w-full gap-2">
        <Row className="gap-2"><span className="typo-caption-2 font-semibold text-foreground">다가오는 7일</span><span className="typo-caption-3 text-place-h">3개</span></Row>
        {UPCOMING.map((s) => <ScheduleRow key={s.title} {...s} />)}
      </Column>
    </BaseCard>
  );
}

function MemberCard({ withTabs }: { withTabs: boolean }) {
  const [tab, setTab] = useState<"members" | "requests" | "settings">("members");
  return (
    <BaseCard className="flex flex-col gap-4 p-5">
      <Column className="gap-0.5">
        <span className="eyebrow">TEAM</span>
        <h2 className="typo-sub-t-1 text-foreground">멤버 <span className="text-place-h">7</span></h2>
      </Column>
      {withTabs && (
        <SegmentedTabs
          label="팀 관리"
          value={tab}
          onChange={setTab}
          tabs={[
            { key: "members", label: "멤버", icon: <Users size={12} /> },
            { key: "requests", label: "신청", icon: <UserPlus size={12} />, badge: 3 },
            { key: "settings", label: "설정", icon: <Settings size={12} /> },
          ]}
        />
      )}
      <Column className="w-full gap-1">
        {MEMBERS.map((m) => (
          <Row key={m.n} className="group w-full gap-3 rounded-lg px-2 py-2 hover:bg-surface-hover">
            <Avatar name={m.n} on={m.on} />
            <Column className="min-w-0 flex-1 gap-0">
              <Row className="gap-1.5">
                <span className="truncate typo-caption-2 font-semibold text-foreground">{m.n}</span>
                {m.role === "SUPER" && <Crown size={12} strokeWidth={2} className="text-pending-500" />}
                {m.role === "SUB" && <Shield size={12} strokeWidth={2} className="text-accent" />}
              </Row>
              <span className="typo-caption-3 text-place-h">{m.p || m.ago}{m.p && ` · ${m.ago}`}</span>
            </Column>
            <MoreVertical size={14} className="text-place-h opacity-0 group-hover:opacity-100" />
          </Row>
        ))}
      </Column>
    </BaseCard>
  );
}

function ActivityCard() {
  return (
    <BaseCard className="flex flex-col gap-3 p-5">
      <Column className="gap-0.5">
        <span className="eyebrow">ACTIVITY</span>
        <Row className="gap-1.5"><Activity size={15} className="text-muted" /><h2 className="typo-sub-t-1 text-foreground">최근 활동</h2></Row>
      </Column>
      <Column className="w-full gap-1.5">
        {[["이하은", "디자인 리뷰 일정을 추가했어요", "2시간 전"], ["wontwo", "김서준 님의 가입을 승인했어요", "어제"], ["wony", "저녁 회식 일정을 수정했어요", "2일 전"]].map(([who, what, when]) => (
          <Row key={what} className="w-full gap-3 px-1 py-1.5">
            <Avatar name={who} size={7} />
            <span className="min-w-0 flex-1 truncate typo-caption-2 text-secondary"><b className="font-semibold text-foreground">{who}</b> {what}</span>
            <span className="shrink-0 typo-caption-3 text-place-h">{when}</span>
          </Row>
        ))}
      </Column>
    </BaseCard>
  );
}

export default function Page() {
  const [mtab, setMtab] = useState<"schedule" | "members" | "activity">("schedule");
  return (
    <div className="mx-auto flex max-w-[1100px] flex-col gap-5 p-4">
      <Hero />

      <div className="hidden gap-5 lg:grid lg:grid-cols-[2fr_1fr]">
        <ScheduleCard />
        <MemberCard withTabs />
      </div>
      <div className="hidden lg:block"><ActivityCard /></div>

      <div className="flex flex-col gap-4 lg:hidden">
        <BaseCard className="p-2">
          <SegmentedTabs
            label="그룹 상세"
            value={mtab}
            onChange={setMtab}
            tabs={[
              { key: "schedule", label: "일정", icon: <CalendarDays size={12} />, badge: 2 },
              { key: "members", label: "멤버", icon: <Users size={12} />, badge: 7 },
              { key: "activity", label: "활동", icon: <Activity size={12} /> },
            ]}
          />
        </BaseCard>
        {mtab === "schedule" && <ScheduleCard />}
        {mtab === "members" && <MemberCard withTabs />}
        {mtab === "activity" && <ActivityCard />}
      </div>
    </div>
  );
}
