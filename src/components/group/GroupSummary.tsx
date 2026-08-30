import React from "react";
import BaseCard from "../ui/card/BaseCard";
import { Column, Row } from "../ui/layout/flex";
import { MyGroupResponse } from "@/src/types/group";
import { CalendarDays, Clock, Users } from "lucide-react";

export default function GroupSummary({ group }: { group: MyGroupResponse }) {
  return (
    <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-[1.3fr_1fr] sm:gap-5">
      <BaseCard className="h-full p-4">
        <Row className="h-full items-center justify-between">
          <Column className="gap-1">
            <span className="typo-caption-2 text-place-h">멤버</span>
            <Row className="items-baseline gap-1">
              <span className="typo-sub-t-1 text-foreground tabular-nums">
                {group.members.length}
              </span>
              <span className="typo-caption-3 text-muted">명</span>
            </Row>
          </Column>

          <Row className="h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-surface-hover text-secondary">
            <Users size={16} strokeWidth={1.5} />
          </Row>
        </Row>
      </BaseCard>

      <Column className="gap-2.5 sm:gap-3">
        <Compact
          icon={<CalendarDays size={15} strokeWidth={1.5} />}
          title="오늘 일정"
          value="0개"
        />
        <Compact
          icon={<Clock size={15} strokeWidth={1.5} />}
          title="다가오는 일정"
          value="0개"
        />
      </Column>
    </div>
  );
}

function Compact({
  icon,
  title,
  value,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
}) {
  return (
    <BaseCard className="flex-1 px-4 py-3">
      <Row className="items-center justify-between">
        <Row className="gap-2">
          <Row className="h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-surface-hover text-secondary">
            {icon}
          </Row>
          <span className="typo-caption-2 text-place-h">{title}</span>
        </Row>

        <span className="typo-caption-2 font-bold text-foreground tabular-nums">
          {value}
        </span>
      </Row>
    </BaseCard>
  );
}
