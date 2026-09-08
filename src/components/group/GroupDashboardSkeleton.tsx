import Skeleton from "../ui/Skeleton";
import { Between, Column, Row } from "../ui/layout/flex";

/** 요약 카드 한 칸. 아이콘 + 라벨 + 값 배치를 그대로 흉내낸다. */
function SummaryCardSkeleton() {
  return (
    <div className="neu-flat w-full rounded-[var(--radius-outer)] px-3 py-3 lg:px-4">
      <div className="flex flex-col gap-1.5 lg:flex-row lg:items-center lg:justify-between lg:gap-2">
        <Row className="gap-2">
          <Skeleton className="h-7 w-7 rounded-full" />
          <Skeleton className="h-3 w-12 self-center" />
        </Row>
        <Skeleton className="h-3 w-8 self-end lg:self-center" />
      </div>
    </div>
  );
}

/** 아바타 + 이름·부제 + 우측 뱃지 형태의 행. 멤버 목록과 같은 구조다. */
function RowSkeleton() {
  return (
    <Between className="neu-flat w-full gap-3 rounded-xl px-4 py-3">
      <Row className="min-w-0 flex-1 gap-3">
        <Skeleton className="h-7 w-7 shrink-0 rounded-full" />
        <Column className="min-w-0 gap-1.5">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-2.5 w-14" />
        </Column>
      </Row>
      <Skeleton className="h-5 w-12 shrink-0 rounded-full" />
    </Between>
  );
}

/** 헤더(eyebrow + 제목)를 가진 카드 */
function SectionCardSkeleton({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`neu-flat w-full rounded-[var(--radius-outer)] p-5 ${className ?? ""}`}
    >
      <Column className="mb-4 gap-1.5">
        <Skeleton className="h-2.5 w-12" />
        <Skeleton className="h-5 w-24" />
      </Column>

      {children}
    </div>
  );
}

/**
 * GroupDashboard와 같은 뼈대로 그린다.
 *
 * 하이드레이션 시점에는 서버·클라이언트가 모두 이 화면을 그리므로
 * 실제 카드와 구조가 어긋나면 전환할 때 레이아웃이 튄다.
 */
export default function GroupDashboardSkeleton() {
  return (
    <Column className="w-full gap-5 pb-1">
      {/* Hero — 아이브로우 + 그룹명 + 설명 + 초대 코드 줄 */}
      <div className="neu-flat w-full rounded-[var(--radius-outer)] p-5">
        <Between className="mb-1.5">
          <Skeleton className="h-2.5 w-12" />
          <Skeleton className="h-6 w-24 rounded-full" />
        </Between>

        <Skeleton className="h-8 w-40" />
        <Skeleton className="mt-2 h-3 w-56" />

        <Between className="mt-5">
          <Row className="gap-3">
            <Skeleton className="h-3 w-14 self-center" />
            <Skeleton className="h-7 w-28 rounded-lg" />
          </Row>
          <Skeleton className="h-4 w-14 self-center" />
        </Between>
      </div>

      {/* Summary — 모바일 2×2, PC 한 줄 */}
      <div className="grid w-full grid-cols-2 gap-2.5 lg:grid-cols-4 lg:gap-5">
        <SummaryCardSkeleton />
        <SummaryCardSkeleton />
        <SummaryCardSkeleton />
        <SummaryCardSkeleton />
      </div>

      {/* 상세 — 모바일은 탭, PC는 나란히 */}
      <Column className="w-full gap-5 lg:hidden">
        <Skeleton className="h-12 w-full rounded-xl" />

        <SectionCardSkeleton>
          <Column className="w-full gap-2.5">
            <RowSkeleton />
            <RowSkeleton />
            <RowSkeleton />
          </Column>
        </SectionCardSkeleton>
      </Column>

      <Row className="hidden w-full gap-5 lg:flex">
        <SectionCardSkeleton className="flex-1 lg:min-h-[380px]">
          <Column className="w-full gap-2.5">
            <RowSkeleton />
            <RowSkeleton />
            <RowSkeleton />
          </Column>
        </SectionCardSkeleton>

        <SectionCardSkeleton className="flex-1 lg:min-h-[380px]">
          <Column className="w-full gap-2.5">
            <RowSkeleton />
            <RowSkeleton />
          </Column>
        </SectionCardSkeleton>
      </Row>
    </Column>
  );
}
