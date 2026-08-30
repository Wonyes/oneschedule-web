import BaseCard from "../ui/card/BaseCard";
import { Between, Column, Row } from "../ui/layout/flex";
import { CalendarDays } from "lucide-react";

export default function GroupScheduleSection() {
  return (
    <BaseCard glow className="flex-1 p-5 h-[420px] lg:h-[520px]">
      <Column className="mb-4 gap-1.5">
        <span className="eyebrow">TODAY</span>
        <Row className="gap-1.5">
          <CalendarDays size={16} strokeWidth={1.5} className="text-muted" />
          <h2 className="typo-sub-t-1 text-foreground">오늘 일정</h2>
        </Row>
      </Column>

      <Column className="gap-2.5">
        <ScheduleItem time="09:00" title="등록된 일정이 없습니다" />

        <ScheduleItem time="13:00" title="새로운 일정이 추가되면 표시됩니다" />
      </Column>
    </BaseCard>
  );
}

function ScheduleItem({ time, title }: { time: string; title: string }) {
  return (
    <Between className="rounded-lg px-3 py-2.5 w-full neu-pressed">
      <span className="typo-caption-2 text-place-h tabular-nums">{time}</span>

      <span className="typo-caption-2 font-medium">{title}</span>
    </Between>
  );
}
