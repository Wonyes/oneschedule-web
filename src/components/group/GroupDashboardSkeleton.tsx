import { Column, Row } from "../ui/layout/flex";

export default function GroupDashboardSkeleton() {
  return (
    <Column className="w-full gap-5 animate-pulse">
      {/* Hero */}
      <div className="h-[220px] w-full rounded-2xl bg-surface" />

      {/* Summary */}
      <div className="h-[160px] w-full rounded-2xl bg-surface" />

      {/* Main */}
      <Row className="w-full gap-5">
        <div className="h-[300px] flex-1 rounded-2xl bg-surface" />
        <div className="h-[300px] flex-1 rounded-2xl bg-surface" />
      </Row>

      {/* Activity */}
      <div className="h-[200px] w-full rounded-2xl bg-surface" />
    </Column>
  );
}
