import { HOURS } from "@/constant/calendar";

type TimeGridProps = {
  className?: string;
};

export default function TimeGrid({ className = "" }: TimeGridProps) {
  return (
    <div className={className}>
      {HOURS.map((_, i) => (
        <div key={i} className="h-14 border-b border-divider" />
      ))}
    </div>
  );
}
