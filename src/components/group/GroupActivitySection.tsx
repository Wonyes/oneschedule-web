import BaseCard from "../ui/card/BaseCard";
import { Column, Row } from "../ui/layout/flex";
import { Activity } from "lucide-react";

export default function GroupActivitySection() {
  return (
    <BaseCard glow className="p-5">
      <Column className="mb-3 gap-1.5">
        <span className="eyebrow">ACTIVITY</span>
        <Row className="gap-1.5">
          <Activity size={16} strokeWidth={1.5} className="text-muted" />
          <h2 className="typo-sub-t-1 text-foreground">최근 활동</h2>
        </Row>
      </Column>

      <Column className="rounded-lg px-4 py-3.5 neu-flat gap-3">
        <span className="typo-caption-2 text-muted">
          최근 그룹 활동이 없습니다.
        </span>
      </Column>
    </BaseCard>
  );
}
