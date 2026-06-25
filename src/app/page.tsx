import CalendarGrid from "../components/calendar/CalendarGrid";
import CalendarHeader from "../components/calendar/CalendarHeader";

export default function DashboardPage() {
  return (
    <div className="bg-back relative overflow-scroll rounded-4xl h-full">
      <CalendarHeader />
      <CalendarGrid />
    </div>
  );
}
