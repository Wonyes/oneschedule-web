import { GroupHero } from "./GroupHero";
import { Column, Row } from "../ui/layout/flex";
import { MyGroupResponse } from "@/src/types/group";

import GroupSummary from "./GroupSummary";
import GroupMemberSection from "./GroupMemberSection ";
import GroupScheduleSection from "./GroupScheduleSection";
import GroupActivitySection from "./GroupActivitySection";

export default function GroupDashboard({ group }: { group: MyGroupResponse }) {
  return (
    <Column className="w-full gap-5">
      {/* Hero */}
      <GroupHero group={group} />

      {/* Summary */}
      <GroupSummary group={group} />

      {/* Main */}
      <Row className="w-full gap-5">
        <GroupMemberSection
          isAdmin={group.groupRole === "SUPER"}
          members={group.members}
          groupNo={group.groupNo}
        />
        <GroupScheduleSection />
      </Row>

      {/* Activity */}
      <GroupActivitySection />
    </Column>
  );
}
