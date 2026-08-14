import BaseCard from "../ui/card/BaseCard";
import { Between, Column, Row } from "../ui/layout/flex";
import { CalendarDays } from "lucide-react";

export default function GroupScheduleSection() {
  return (
    <BaseCard glow className="flex-1 p-6 h-[420px] lg:h-[520px]">
      <Row className="mb-6 gap-2">
        <CalendarDays size={18} />

        <h2 className="typo-title-2 text-white">오늘 일정</h2>
      </Row>

      <Column className="gap-4">
        <ScheduleItem time="09:00" title="등록된 일정이 없습니다" />

        <ScheduleItem time="13:00" title="새로운 일정이 추가되면 표시됩니다" />
      </Column>
    </BaseCard>
  );
}

function ScheduleItem({ time, title }: { time: string; title: string }) {
  return (
    <Between className="rounded-xl border border-slate-800 bg-slate-900/40 px-4 w-full neu-pressed py-3 ">
      <span className="typo-caption-2 text-slate-500 ">{time}</span>

      <span className="typo-sub-t-3">{title}</span>
    </Between>
  );
}
