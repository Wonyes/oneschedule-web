"use client";

import { AnimatePresence, motion } from "motion/react";
import { CalendarDays, ChevronDown } from "lucide-react";
import { format } from "date-fns";
import { ko } from "date-fns/locale";

import { Input } from "@/src/components/ui/layout/input";
import { useCalendarStore } from "@/src/hooks/stores/useCalendarStore";
import { SheetForm } from "@/src/hooks/stores/useSheetStore";
import { springFirm } from "@/src/lib/motion";
import { cn } from "@/src/utils/cn";
import { formatTime } from "@/src/utils/time";
import CalendarBody from "../calendar/CalendarBody";
import { FieldLabel } from "../SheetParts";

type When = Pick<SheetForm, "startDate" | "endDate" | "startTime" | "endTime">;

/** 날짜 버튼(펼치면 달력) + 시작·종료 시간 */
export default function WhenField({
  value,
  readOnly,
  onChange,
}: {
  value: When;
  readOnly: boolean;
  onChange: (patch: Partial<When>) => void;
}) {
  const { isCalendarOpen, toggleCalendar } = useCalendarStore();

  const dateLabel = value.startDate
    ? format(value.startDate, "M월 d일 (EEE)", { locale: ko })
    : "날짜 선택";

  return (
    <div className="flex flex-col gap-2">
      <FieldLabel required>WHEN</FieldLabel>
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 sm:grid-cols-[1.4fr_1fr_auto_1fr]">
        <button
          type="button"
          disabled={readOnly}
          onClick={() => toggleCalendar(value.startDate)}
          aria-expanded={isCalendarOpen}
          className={cn(
            "btn-spring col-span-3 flex h-[52px] items-center gap-2.5 rounded-xl px-4 text-left sm:col-span-1",
            "border transition-colors",
            isCalendarOpen
              ? "neu-pressed border-accent/60 text-accent"
              : "neu-btn border-accent/20 text-foreground hover:-translate-y-0.5 hover:border-accent/50",
          )}
        >
          <CalendarDays
            size={15}
            strokeWidth={1.75}
            className="shrink-0 text-accent"
          />
          <span className="min-w-0 flex-1 truncate typo-caption-1 font-medium">
            {dateLabel}
            {value.endDate &&
              ` ~ ${format(value.endDate, "M월 d일", { locale: ko })}`}
          </span>
          <span
            className={cn(
              "flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent/12 text-accent transition-transform",
              isCalendarOpen && "rotate-180",
            )}
          >
            <ChevronDown size={13} strokeWidth={2} />
          </span>
        </button>

        <Input
          type="text"
          label="시작"
          inputMode="numeric"
          value={value.startTime}
          maxLength={5}
          readOnly={readOnly}
          onChange={(e) => onChange({ startTime: formatTime(e.target.value) })}
        />
        <span className="typo-caption-2 text-place-h">~</span>
        <Input
          type="text"
          label="종료"
          inputMode="numeric"
          value={value.endTime}
          maxLength={5}
          readOnly={readOnly}
          onChange={(e) => onChange({ endTime: formatTime(e.target.value) })}
        />
      </div>

      <AnimatePresence initial={false}>
        {isCalendarOpen && (
          <motion.div
            key="calendar"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={springFirm}
            className="overflow-hidden"
          >
            <div className="-mx-3 px-3 pb-3 pt-2">
              <CalendarBody />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
