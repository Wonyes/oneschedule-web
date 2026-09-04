import Skeleton from "../ui/Skeleton";
import { Column, Row } from "../ui/layout/flex";

/**
 * GroupDashboard와 같은 구조(GroupHero/GroupSummary/GroupMemberSection+
 * GroupScheduleSection/GroupActivitySection)로 배치하고, 실제 렌더된
 * 카드 높이(172 / 132 / 420·520)를 그대로 맞춘다.
 */
export default function GroupDashboardSkeleton() {
  return (
    <Column className="w-full gap-5">
      {/* Hero */}
      <Skeleton className="h-[172px] w-full rounded-[var(--radius-outer)]" />

      {/* Summary */}
      <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-[1.3fr_1fr] sm:gap-5">
        <Skeleton className="h-[132px] w-full rounded-[var(--radius-outer)]" />
        <Skeleton className="h-[132px] w-full rounded-[var(--radius-outer)]" />
      </div>

      {/* Main: GroupMemberSection + GroupScheduleSection */}
      <Row className="w-full flex-col gap-5 lg:flex-row">
        <Skeleton className="h-[420px] w-full rounded-[var(--radius-outer)] lg:h-[520px] lg:flex-1" />
        <Skeleton className="h-[420px] w-full rounded-[var(--radius-outer)] lg:h-[520px] lg:flex-1" />
      </Row>

      {/* Activity — GroupActivitySection의 실제 로딩 상태(헤더 + 항목 2줄)와 같은 모양 */}
      <div className="w-full rounded-[var(--radius-outer)] neu-flat p-5">
        <Column className="mb-3 gap-1.5">
          <Skeleton className="h-2.5 w-14" />
          <Skeleton className="h-5 w-20" />
        </Column>

        <Column className="w-full gap-2">
          <Skeleton className="h-14 w-full rounded-lg" />
          <Skeleton className="h-14 w-full rounded-lg" />
        </Column>
      </div>
    </Column>
  );
}
