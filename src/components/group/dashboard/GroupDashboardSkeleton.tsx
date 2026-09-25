import Skeleton from "@/src/components/ui/Skeleton";
import {
  ActivityRowSkeleton,
  DayGroupSkeleton,
  HeadingSkeleton,
  MemberRowSkeleton,
  TabsSkeleton,
} from "@/src/components/ui/SkeletonParts";
import { Column, Row } from "@/src/components/ui/layout/flex";
import { GROUP_SECTION_HEIGHT } from "./sectionHeight";

function ScheduleSectionSkeleton() {
  return (
    <div
      className={`neu-flat flex w-full flex-col rounded-[var(--radius-outer)] p-5 ${GROUP_SECTION_HEIGHT}`}
    >
      <Row className="mb-4 shrink-0 items-start justify-between gap-3">
        <HeadingSkeleton />
        <Skeleton className="h-9 w-24 shrink-0 rounded-xl" />
      </Row>
      <Column className="min-h-0 w-full flex-1 gap-4 overflow-hidden">
        <DayGroupSkeleton items={2} />
        <DayGroupSkeleton items={1} />
      </Column>
    </div>
  );
}

function MemberSectionSkeleton({ withTabs }: { withTabs: boolean }) {
  return (
    <div
      className={`neu-flat flex w-full flex-col rounded-[var(--radius-outer)] p-5 ${GROUP_SECTION_HEIGHT}`}
    >
      <HeadingSkeleton className="mb-4 gap-1" />
      {withTabs && (
        <div className="mb-4">
          <TabsSkeleton count={2} />
        </div>
      )}
      <Column className="min-h-0 w-full flex-1 gap-1 overflow-hidden">
        {Array.from({ length: 5 }, (_, i) => (
          <MemberRowSkeleton key={i} />
        ))}
      </Column>
    </div>
  );
}

function ActivitySectionSkeleton() {
  return (
    <div className="neu-flat flex w-full flex-col rounded-[var(--radius-outer)] p-4 sm:p-5">
      <HeadingSkeleton className="mb-3 gap-1" />
      <Column className="w-full">
        <ActivityRowSkeleton />
        <ActivityRowSkeleton />
        <ActivityRowSkeleton />
      </Column>
    </div>
  );
}

/** GroupHero 자리: 오빗 + 라벨 줄 + 제목·소개 + 통계 + 액션 줄 */
function HeroSkeleton() {
  return (
    <div className="neu-flat relative w-full overflow-hidden rounded-[var(--radius-outer)] p-4 sm:p-6">
      <div className="flex flex-col items-center gap-5 lg:flex-row lg:items-center lg:gap-10">
        <Skeleton className="h-48 w-48 shrink-0 rounded-full sm:h-56 sm:w-56" />

        <Column className="w-full min-w-0 flex-1 items-center gap-2 lg:items-start">
          <Row className="gap-1.5">
            <Skeleton className="h-2.5 w-12" />
            <Skeleton className="h-6 w-14 rounded-full" />
            <Skeleton className="h-6 w-16 rounded-full" />
          </Row>
          <Skeleton className="h-8 w-44 max-w-full" />
          <Skeleton className="h-3 w-64 max-w-full" />

          <Row className="mt-1 flex-wrap justify-center gap-x-4 gap-y-1.5 lg:justify-start">
            {Array.from({ length: 4 }, (_, i) => (
              <Row key={i} className="items-baseline gap-1">
                <Skeleton className="h-2.5 w-8" />
                <Skeleton className="h-3.5 w-5" />
              </Row>
            ))}
          </Row>

          <Row className="mt-2 w-full flex-wrap justify-center gap-2 lg:justify-start">
            <Skeleton className="h-9 w-40 rounded-lg" />
            <Skeleton className="h-9 w-24 rounded-lg" />
            <Skeleton className="h-9 w-20 rounded-lg lg:ml-auto" />
          </Row>
        </Column>
      </div>
    </div>
  );
}

export default function GroupDashboardSkeleton() {
  return (
    <Column className="w-full gap-5 pb-1">
      <HeroSkeleton />

      {/* 모바일: 탭 카드 + 일정 섹션 */}
      <Column className="w-full gap-5 lg:hidden">
        <div className="neu-flat w-full rounded-[var(--radius-outer)] p-2">
          <TabsSkeleton count={3} />
        </div>
        <ScheduleSectionSkeleton />
      </Column>

      {/* 데스크톱: 왼쪽 일정+활동, 오른쪽 멤버(탭) */}
      <div className="hidden w-full items-start gap-5 lg:grid lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <Column className="min-w-0 gap-5">
          <ScheduleSectionSkeleton />
          <ActivitySectionSkeleton />
        </Column>
        <MemberSectionSkeleton withTabs />
      </div>
    </Column>
  );
}
