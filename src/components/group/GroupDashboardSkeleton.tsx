import Skeleton from "../ui/Skeleton";
import { Between, Column, Row } from "../ui/layout/flex";

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

export default function GroupDashboardSkeleton() {
  return (
    <Column className="w-full gap-5 pb-1">
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

      <div className="grid w-full grid-cols-2 gap-2.5 lg:grid-cols-4 lg:gap-5">
        <SummaryCardSkeleton />
        <SummaryCardSkeleton />
        <SummaryCardSkeleton />
        <SummaryCardSkeleton />
      </div>

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
