import { HOURS } from "@/constant/calendar";

export default function HourColumn() {
  return (
    <div className="bg-main-bg border-r border-divider">
      {HOURS.map((hour) => (
        <div
          key={hour}
          className="h-14 flex items-center justify-center text-[11px] text-muted border-b border-divider"
        >
          {hour}
        </div>
      ))}
    </div>
  );
}
