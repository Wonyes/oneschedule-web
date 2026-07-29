import { HOURS } from "@/src/constant/schedule";

type TimeGridProps = {
  className?: string;
  onClickTime?: (startTime: string) => void;
};
export default function TimeGrid({
  className = "",
  onClickTime,
}: TimeGridProps) {
  return (
    <div className={className}>
      {HOURS.map((hour, i) => (
        <div
          onClick={(e) => {
            e.stopPropagation();
            onClickTime?.(hour);
          }}
          key={i}
          className="h-14 border-b border-divider"
        />
      ))}
    </div>
  );
}
