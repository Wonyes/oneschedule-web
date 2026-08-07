import BaseCard from "../ui/card/BaseCard";
import { Column, Row } from "../ui/layout/flex";
import { Activity } from "lucide-react";

export default function GroupActivitySection() {
  return (
    <BaseCard
      glow
      className="
          p-6
        "
    >
      <Row className="mb-5 gap-2">
        <Activity size={18} />

        <h2 className="typo-title-2 text-white">최근 활동</h2>
      </Row>

      <Column
        className="
            rounded-2xl
            bg-slate-900/40
            p-5
            neu-pressed
            gap-3
          "
      >
        <span className="typo-sub-t-3 text-slate-400">
          최근 그룹 활동이 없습니다.
        </span>
      </Column>
    </BaseCard>
  );
}
