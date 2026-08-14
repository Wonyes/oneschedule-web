"use client";

import { useEffect } from "react";
import { X } from "lucide-react";
import { useSheetStore } from "@/src/hooks/stores/useSheetStore";
import { format } from "date-fns";
import { Input } from "../layout/input";
import { Column } from "../layout/flex";
import { Primary, SecondaryBtn, GhostBtn } from "../layout/button";
import CalendarBody from "./calendar/CalendarBody";
import { useCalendarStore } from "@/src/hooks/stores/useCalendarStore";
import { formatTime } from "@/src/utils/time";
import { EVENT_STYLES } from "@/src/constant/schedule";

const categories = [
  { value: "work", label: "업무" },
  { value: "personal", label: "개인" },
  { value: "meeting", label: "약속" },
  { value: "important", label: "운동" },
] as const;

function SheetHeader({ onClose }: { onClose: () => void }) {
  return (
    <header className="flex items-center justify-between border-b border-white/10 px-4 sm:px-6 py-4">
      <h2 className="typo-title-2 text-white">일정 추가</h2>
      <GhostBtn
        icon={<X size={20} />}
        onClick={onClose}
        className="h-auto rounded-full p-2"
      />
    </header>
  );
}

function SheetFooter({ onClose }: { onClose: () => void }) {
  return (
    <footer className="border-t border-white/10 px-4 sm:px-6 py-4 bg-surface/90  rounded-b-[32px]">
      <div className="flex gap-3">
        <SecondaryBtn text="취소" onClick={onClose} className="flex-1" />
        <Primary text="저장" className="flex-1" />
      </div>
    </footer>
  );
}

export default function Sheet() {
  const { form, updateForm, open, closeSheet } = useSheetStore();
  const { isCalendarOpen, toggleCalendar } = useCalendarStore();

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "unset";

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [open]);

  const close = () => {
    closeSheet();
    if (isCalendarOpen) toggleCalendar();
  };

  const currentForm = form;
  if (!currentForm) return null;

  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-black/60 transition-opacity duration-300 ${
          open
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
        onClick={close}
      />

      <section
        className={`fixed bottom-0 left-0 right-0 z-50 mx-auto flex h-[75vh] max-w-[800px] flex-col rounded-t-[32px] glass text-slate-100 transition-transform duration-300 ease-out ${
          open
            ? "translate-y-0 pointer-events-auto"
            : "translate-y-full pointer-events-none"
        }`}
      >
        <SheetHeader onClose={close} />

        <div className="flex-1 space-y-6 overflow-y-auto px-4 sm:px-6 py-6 scrollbar-thin">
          <Column className="space-y-2 gap-1.5">
            <label className="typo-sub-t-2 text-slate-200">📝 제목</label>
            <Input
              value={currentForm.title}
              onChange={(e) => updateForm({ title: e.target.value })}
              placeholder="일정 제목을 입력하세요."
            />
          </Column>

          <Column className="space-y-2 gap-1.5">
            <label className="typo-sub-t-2 text-slate-200">📅 날짜</label>

            <button
              type="button"
              onClick={() => toggleCalendar(currentForm.startDate)}
              className="flex w-full items-center justify-between rounded-xl neu-pressed px-4 py-3 text-left hover:ring-2 hover:ring-indigo-500/30 transition-all shadow-sm"
            >
              <div className="flex items-center gap-2">
                <span className="typo-caption-2 text-foreground font-medium">
                  {currentForm.startDate
                    ? format(currentForm.startDate, "yyyy. MM. dd")
                    : "날짜를 선택해 주세요."}
                </span>

                <span className="text-place-h typo-caption-2">
                  {currentForm.endDate ? "~" : ""}
                </span>

                <span className="typo-caption-2 text-foreground font-medium">
                  {currentForm.endDate &&
                    format(currentForm.endDate, "yyyy. MM. dd")}
                </span>
              </div>
            </button>
            {isCalendarOpen && <CalendarBody />}
          </Column>

          <Column className="space-y-2 gap-1.5">
            <label className="typo-sub-t-2 text-slate-200">⏰ 시간</label>

            <div className="flex items-center gap-3">
              <Input
                type="text"
                value={currentForm.startTime}
                maxLength={5}
                placeholder="00:00"
                onChange={(e) =>
                  updateForm({ startTime: formatTime(e.target.value) })
                }
              />

              <span className="text-place-h font-medium">~</span>

              <Input
                type="text"
                value={currentForm.endTime}
                maxLength={5}
                placeholder="00:00"
                onChange={(e) =>
                  updateForm({ endTime: formatTime(e.target.value) })
                }
              />
            </div>
          </Column>

          <Column className="gap-2">
            <label className="typo-sub-t-2 text-slate-200">🏷️ 카테고리</label>

            <div className="flex flex-wrap gap-2">
              {categories.map((item) => {
                const active = currentForm.category === item.value;
                const style = EVENT_STYLES[item.value];

                return (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() => updateForm({ category: item.value })}
                    className={`
                      rounded-full
                      px-4
                      py-2
                      typo-caption-2
                      transition-all
                      duration-200
                      border
                      ${
                        active
                          ? `${style.label} ${style.border} scale-[1.03] shadow-md`
                          : `border-white/10 neu-pressed text-slate-400 hover:text-slate-200`
                      }
                    `}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>
          </Column>

          <Column className="space-y-2 gap-1.5">
            <label className="typo-sub-t-2 text-slate-200">📌 메모</label>

            <Input
              value={currentForm.content}
              onChange={(e) => updateForm({ content: e.target.value })}
              placeholder="일정 내용을 입력하세요."
            />
          </Column>
        </div>

        <SheetFooter onClose={close} />
      </section>
    </>
  );
}
