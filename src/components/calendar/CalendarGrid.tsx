import { Timer } from "lucide-react";

const days = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const hours = Array.from({ length: 24 }, (_, i) => `${i + 1}`);

export default function CalendarGrid() {
  return (
    <div className="grid grid-cols-8 bg-surface border border-divider overflow-hidden">
      <div className="h-14 border-b border-divider flex items-center bg-back justify-center text-xs text-muted ">
        <Timer size={16} className="mr-1" />
      </div>

      {days.map((day) => (
        <div
          key={day}
          className="h-14 border-b border-divider flex items-center bg-back justify-center text-sm text-t-title font-medium "
        >
          {day}
        </div>
      ))}

      <div className="border-r border-divider bg-main-bg">
        {hours.map((hour) => (
          <div
            key={hour}
            className="h-16 px-3 pt-2 text-xs text-muted border-b border-divider"
          >
            {hour}:00
          </div>
        ))}
      </div>

      {days.map((day) => (
        <div key={day} className="relative border-r border-divider">
          {hours.map((_, i) => (
            <div key={i} className="h-16 border-b border-divider" />
          ))}

          {day === "Tuesday" && (
            <div className="absolute top-[140px] left-2 right-2 bg-white border border-divider rounded-xl px-3 py-2 shadow-sm">
              <p className="text-sm text-t-title">Meeting</p>
              <p className="text-xs text-muted">11:00 - 12:00</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
