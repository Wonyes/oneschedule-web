import CalendarHeader from "../components/calendar/CalendarHeader";
import Calendar from "../components/calendar/Calendar";

export default function DashboardPage() {
  return (
    <div className="bg-back relative rounded-4xl h-full">
      <CalendarHeader />
      <Calendar />
    </div>
  );
}
