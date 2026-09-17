import Skeleton from "./Skeleton";
import { Column, Row } from "./layout/flex";

/**
 * 실제 컴포넌트와 같은 치수의 스켈레톤 조각들.
 * 실제 마크업이 바뀌면 여기도 같이 바꾼다 (주석의 컴포넌트 이름이 기준).
 */

/** SectionHeading (eyebrow + h2) */
export function HeadingSkeleton({ className }: { className?: string }) {
  return (
    <Column className={className ?? "gap-1"}>
      <Skeleton className="h-2.5 w-14" />
      <Skeleton className="h-5 w-24" />
    </Column>
  );
}

/** SegmentedTabs (neu-pressed 트랙 + 첫 탭 활성) */
export function TabsSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="neu-pressed flex h-10 w-full gap-1 rounded-xl p-1">
      <div className="neu-flat h-full flex-1 rounded-lg" />
      {Array.from({ length: count - 1 }, (_, i) => (
        <div key={i} className="flex-1" />
      ))}
    </div>
  );
}

/** DayGroup (DayTile 48px + 라벨 줄 + ScheduleItem n개) */
export function DayGroupSkeleton({ items = 2 }: { items?: number }) {
  return (
    <Row className="w-full items-start gap-3">
      <Skeleton className="h-12 w-12 shrink-0 rounded-xl" />
      <Column className="min-w-0 flex-1 gap-0.5">
        <Row className="h-5 items-center gap-1.5 px-1">
          <Skeleton className="h-3 w-10" />
          <Skeleton className="h-2.5 w-14" />
        </Row>
        {Array.from({ length: items }, (_, i) => (
          <Row
            key={i}
            className="w-full items-center gap-2.5 border-b border-dashed border-divider px-1 py-2 last:border-none"
          >
            <Skeleton className="h-2 w-2 shrink-0 rounded-full" />
            <Skeleton className="h-3 w-[86px] shrink-0" />
            <Skeleton className="h-3 flex-1" />
          </Row>
        ))}
      </Column>
    </Row>
  );
}

/** MemberRow · JoinRequestRow (아바타 36 + 두 줄) */
export function MemberRowSkeleton() {
  return (
    <Row className="w-full gap-3 rounded-lg px-2 py-2">
      <Skeleton className="h-9 w-9 shrink-0 rounded-full" />
      <Column className="min-w-0 flex-1 gap-1.5">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-2.5 w-14" />
      </Column>
    </Row>
  );
}

/** GroupActivitySection 줄 (아바타 32 + 문장 + 메타) */
export function ActivityRowSkeleton() {
  return (
    <Row className="w-full items-start gap-3 py-2">
      <Skeleton className="h-8 w-8 shrink-0 rounded-full" />
      <Column className="min-w-0 flex-1 gap-1.5 pt-1">
        <Skeleton className="h-3 w-48 max-w-full" />
        <Skeleton className="h-2.5 w-28" />
      </Column>
    </Row>
  );
}

/** NotificationItem. compact는 홈 카드의 한 줄 버전 */
export function NotificationRowSkeleton({ compact = false }: { compact?: boolean }) {
  if (compact) {
    return (
      <Row className="w-full items-center gap-2.5 rounded-lg px-1.5 py-1.5">
        <Skeleton className="h-8 w-8 shrink-0 rounded-full" />
        <Skeleton className="h-3 w-24 shrink-0" />
        <Skeleton className="hidden h-2.5 flex-1 sm:block" />
        <Skeleton className="h-2.5 w-10 shrink-0" />
      </Row>
    );
  }
  return (
    <Row className="w-full items-start gap-3 rounded-xl px-3 py-2.5">
      <Skeleton className="h-8 w-8 shrink-0 rounded-full" />
      <Column className="min-w-0 flex-1 gap-1.5">
        <Skeleton className="h-3 w-40 max-w-full" />
        <Skeleton className="h-2.5 w-52 max-w-full" />
        <Skeleton className="h-2.5 w-12" />
      </Column>
    </Row>
  );
}

/** PublicGroupCard 타일 (아바타 64 + 이름 + 멤버 수 + 설명) */
export function GroupTileSkeleton() {
  return (
    <Column className="items-center gap-2.5 p-3">
      <Skeleton className="h-16 w-16 rounded-full" />
      <Column className="items-center gap-1">
        <Skeleton className="h-3.5 w-16" />
        <Skeleton className="h-2.5 w-8" />
        <Skeleton className="h-2.5 w-24" />
      </Column>
    </Column>
  );
}
