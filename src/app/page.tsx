import Schedule from "../components/schedule/Schedule";
import ScheduleHeader from "../components/schedule/ScheduleHeader";

export default function DashboardPage() {
  return (
    <div className="bg-back relative rounded-4xl h-full">
      <ScheduleHeader />
      <Schedule />
    </div>
  );
}
