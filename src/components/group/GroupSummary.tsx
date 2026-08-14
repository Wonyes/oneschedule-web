import React from "react";
import { Column, Row } from "../ui/layout/flex";
import BaseCard from "../ui/card/BaseCard";
import { CalendarDays, Clock, Users } from "lucide-react";
import { MyGroupResponse } from "@/src/types/group";

export default function GroupSummary({ group }: { group: MyGroupResponse }) {
  return (
    <Row className="w-full gap-3 flex-col sm:flex-row sm:gap-5">
      <Summary
        icon={<Users size={22} />}
        title="멤버"
        value={`${group.members.length}명`}
      />

      <Summary
        icon={<CalendarDays size={22} />}
        title="오늘 일정"
        value="0개"
      />

      <Summary icon={<Clock size={22} />} title="다가오는 일정" value="0개" />
    </Row>
  );
}

function Summary({
  icon,
  title,
  value,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
}) {
  return (
    <BaseCard className="flex-1 p-5" glow>
      <Row className="gap-4">
        <Row className="h-11 w-11 justify-center rounded-xl bg-blue-500/10 text-blue-400">
          {icon}
        </Row>

        <Column>
          <span className="typo-caption-2 text-slate-500">{title}</span>

          <span className="mt-1 text-xl font-bold text-white">{value}</span>
        </Column>
      </Row>
    </BaseCard>
  );
}
