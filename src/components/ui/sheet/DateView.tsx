import { useCalendarStore } from "@/src/hooks/stores/useCalendarStore";
import { ArrowBigDown } from "lucide-react";
import { useCalendarLogic } from "./calendar/useCalendarLogic";
import { Between } from "../layout/flex";

export default function DateView() {
  const { getFormattedDateRange } = useCalendarLogic();
  const { toggleCalendar } = useCalendarStore();
  return (
    <Between className="gap-[8px] pointer" onClick={() => toggleCalendar()}>
      <span className="typo-caption-2">
        {getFormattedDateRange() ? getFormattedDateRange() : "날짜 선택"}
      </span>
      <ArrowBigDown size="18" />
    </Between>
  );
}
