import { Plus } from "lucide-react";

import { GroupHero } from "./GroupHero";
import { Column, Row } from "../ui/layout/flex";
import { MyGroupResponse } from "@/src/types/group";

import GroupSummary from "./GroupSummary";
import GroupMemberSection from "./GroupMemberSection";
import GroupScheduleSection from "./GroupScheduleSection";
import GroupActivitySection from "./GroupActivitySection";
import GroupSwitcher from "./GroupSwitcher";

export default function GroupDashboard({
  group,
  groups = [],
  onAddGroup,
}: {
  group: MyGroupResponse;
  groups?: MyGroupResponse[];
  onAddGroup?: () => void;
}) {
  return (
    <Column className="w-full h-full px-4 py-4 gap-5 overflow-y-auto scroll-stable">
      <Row className="w-full items-center justify-end gap-1.5">
        {groups.length > 1 && <GroupSwitcher />}

        <button
          type="button"
          onClick={onAddGroup}
          className="btn-spring neu-btn text-secondary hover:text-foreground flex h-8 items-center gap-1.5 rounded-lg px-3 typo-caption-2 font-medium"
        >
          <Plus size={14} strokeWidth={2} />
          그룹 추가
        </button>
      </Row>

      {/* Hero */}
      <GroupHero group={group} />

      {/* Summary */}
      <GroupSummary group={group} />

      {/* Main */}
      <Row className="w-full gap-5 flex-col lg:flex-row">
        <GroupMemberSection
          isAdmin={group?.groupRole === "SUPER"}
          members={group.members}
          groupNo={group.groupNo}
        />
        <GroupScheduleSection group={group} />
      </Row>

      {/* Activity */}
      <GroupActivitySection group={group} />
    </Column>
  );
}
