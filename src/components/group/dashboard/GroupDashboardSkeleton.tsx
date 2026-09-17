import Skeleton from "../../ui/Skeleton";
import { Column, Row } from "../../ui/layout/flex";

function RowSkeleton() {
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

function ScheduleRowSkeleton() {
  return (
    <Row className="neu-flat w-full gap-3 rounded-lg px-3 py-2.5">
      <Skeleton className="h-3 w-[92px] shrink-0" />
      <Skeleton className="h-3 flex-1" />
      <Skeleton className="h-3 w-10 shrink-0" />
    </Row>
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
        <Skeleton className="h-2.5 w-14" />
        <Skeleton className="h-5 w-24" />
      </Column>

      {children}
    </div>
  );
}

function HeroSkeleton() {
  return (
    <div className="neu-flat w-full rounded-[var(--radius-outer)] p-5 sm:p-6">
      <Row className="items-start gap-4">
        <Skeleton className="h-16 w-16 shrink-0 rounded-[22px] sm:h-[72px] sm:w-[72px]" />
        <Column className="min-w-0 flex-1 gap-2">
          <Row className="gap-1.5">
            <Skeleton className="h-2.5 w-12" />
            <Skeleton className="h-6 w-20 rounded-full" />
          </Row>
          <Skeleton className="h-8 w-44" />
          <Skeleton className="h-3 w-64" />
        </Column>
      </Row>

      <Row className="mt-5 flex-wrap gap-2 border-t border-divider pt-4">
        <Skeleton className="h-8 w-24 rounded-lg" />
        <Skeleton className="h-8 w-16 rounded-lg" />
        <Skeleton className="h-8 w-16 rounded-lg" />
        <Skeleton className="h-8 w-36 rounded-lg" />
      </Row>
    </div>
  );
}

export default function GroupDashboardSkeleton() {
  return (
    <Column className="w-full gap-5 pb-1">
      <HeroSkeleton />

      <Column className="w-full gap-5 lg:hidden">
        <SectionCardSkeleton>
          <Skeleton className="mb-4 h-11 w-full rounded-xl" />
          <Column className="w-full gap-2">
            <ScheduleRowSkeleton />
            <ScheduleRowSkeleton />
            <ScheduleRowSkeleton />
          </Column>
        </SectionCardSkeleton>
      </Column>

      <Column className="hidden w-full gap-5 lg:flex">
        <div className="grid w-full gap-5 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
          <SectionCardSkeleton className="lg:min-h-[380px]">
            <Column className="w-full gap-2">
              <ScheduleRowSkeleton />
              <ScheduleRowSkeleton />
              <ScheduleRowSkeleton />
              <ScheduleRowSkeleton />
            </Column>
          </SectionCardSkeleton>

          <SectionCardSkeleton className="lg:min-h-[380px]">
            <Column className="w-full gap-1">
              <RowSkeleton />
              <RowSkeleton />
              <RowSkeleton />
              <RowSkeleton />
            </Column>
          </SectionCardSkeleton>
        </div>

        <SectionCardSkeleton>
          <Column className="w-full gap-1">
            <RowSkeleton />
            <RowSkeleton />
          </Column>
        </SectionCardSkeleton>
      </Column>
    </Column>
  );
}
