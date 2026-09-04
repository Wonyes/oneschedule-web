import { GroupHero } from "./GroupHero";
import { Column, Row } from "../ui/layout/flex";
import { MyGroupResponse } from "@/src/types/group";

import GroupSummary from "./GroupSummary";
import GroupMemberSection from "./GroupMemberSection";
import GroupScheduleSection from "./GroupScheduleSection";
import GroupActivitySection from "./GroupActivitySection";

export default function GroupDashboard({ group }: { group: MyGroupResponse }) {
  return (
    <Column className="w-full h-full gap-5 overflow-y-auto scroll-stable">
      {/* Hero */}
      <GroupHero group={group} />

      {/* Summary */}
      <GroupSummary group={group} />

      {/* Main */}
      <Row className="w-full gap-5 flex-col lg:flex-row">
        <GroupMemberSection
          // SUPER/SUB 모두 멤버를 관리할 수 있다. SUPER 본인은 GroupMemberSection의
          // "member.groupRole !== SUPER" 조건으로 건드릴 수 없게 막혀 있다.
          isAdmin={group?.groupRole === "SUPER" || group?.groupRole === "SUB"}
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
