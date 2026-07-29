"use client";

import { useEffect } from "react";
import { X } from "lucide-react";
import { useSheetStore } from "@/src/hooks/stores/useSheetStore";
import { format } from "date-fns";
import { Input } from "../layout/input";
import { Column } from "../layout/flex";
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

  if (!open || !form) return null;

  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-black/30 transition-opacity duration-300 ${
          open
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
      />

      <section
        className={`fixed bottom-0 left-0 right-0 z-50 mx-auto flex h-[70vh] max-w-[800px] flex-col rounded-t-3xl bg-white transition-transform duration-300 ${
          open ? "translate-y-0" : "translate-y-full"
        }`}
      >
        {/* Header */}
        <header className="flex items-center justify-between  border-b border-line px-5 py-4">
          <h2 className="typo-title-2">일정 추가</h2>

          <button onClick={close} className="rounded-md p-1 hover:bg-gray-100">
            <X size={22} />
          </button>
        </header>

        {/* Body */}
        <div className="flex-1 space-y-6 overflow-y-auto p-5">
          {/* 제목 */}
          <Column className="space-y-2 gap-1">
            <label className="typo-sub-t-2">📝 제목</label>

            <Input placeholder="일정 제목을 입력하세요." />
          </Column>

          {/* 날짜 */}
          <Column className="space-y-2 gap-1">
            <label className="typo-sub-t-2">📅 날짜</label>

            <button
              onClick={() => toggleCalendar(form.startDate)}
              className="flex w-full shadow-soft items-center gap-2 rounded-xl border border-line px-4 py-2"
            >
              <span className="typo-caption-2 py-1">
                {form.startDate
                  ? format(form.startDate, "yyyy. MM. dd")
                  : "날짜를 선택해 주세요."}
              </span>

              <span className="text-muted typo-caption-2">
                {form.endDate ? "~" : ""}
              </span>

              <span className="typo-caption-2">
                {form.endDate && format(form.endDate, "yyyy. MM. dd")}
              </span>
            </button>
            {isCalendarOpen && <CalendarBody />}
          </Column>

          {/* 시간 */}
          <Column className="space-y-2 gap-1">
            <label className=" typo-sub-t-2">⏰ 시간</label>

            <div className="flex items-center gap-3">
              <Input
                type="text"
                value={form.startTime}
                maxLength={5}
                placeholder="00:00"
                onChange={(e) =>
                  updateForm({ startTime: formatTime(e.target.value) })
                }
              />

              <span>~</span>

              <Input
                type="text"
                value={form.endTime}
                maxLength={5}
                placeholder="00:00"
                onChange={(e) =>
                  updateForm({ endTime: formatTime(e.target.value) })
                }
              />
            </div>
          </Column>

          {/* 카테고리 */}
          <Column className="gap-2">
            <label className="typo-sub-t-2">🏷️ 카테고리</label>

            <div className="flex flex-wrap gap-2">
              {categories.map((item) => {
                const active = form.category === item.value;
                const style = EVENT_STYLES[item.value];

                return (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() => updateForm({ category: item.value })}
                    className={`
                      shadow-soft
                      rounded-full
                      px-4
                      py-2
                      typo-caption-2
                      transition-all
                      duration-200
                      border
                      ${
                        active
                          ? `${style.label} ${style.border} scale-[1.03]`
                          : `border-divider bg-white text-muted ${style.hover}`
                      }
                    `}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>
          </Column>

          {/* 메모 */}
          <Column className="space-y-2 gap-1">
            <label className=" typo-sub-t-2">📌 메모</label>

            <Input
              value={form.title}
              onChange={(e) => updateForm({ title: e.target.value })}
              placeholder="일정 제목을 입력하세요."
            />
          </Column>
        </div>

        {/* Footer */}
        <footer className="border-t border-line p-5">
          <div className="flex gap-3">
            <button
              onClick={close}
              className="flex-1 rounded-xl typo-caption-2 border border-line py-3 font-medium"
            >
              취소
            </button>

            <button className="flex-1 rounded-xl typo-caption-2 bg-blue-600 border-line py-3 font-medium text-white">
              저장
            </button>
          </div>
        </footer>
      </section>
    </>
  );
}
