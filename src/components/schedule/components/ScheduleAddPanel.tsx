"use client";

import { useState } from "react";
import { FileText, Calendar, Clock, Tag, Star } from "lucide-react";

export default function ScheduleAddPanel() {
  const [category, setCategory] = useState("업무");
  const categories = ["업무", "개인", "약속", "운동"] as const;

  return (
    <div className="flex flex-col gap-5">
      <h3 className="typo-sub-t-2 text-foreground font-bold">일정 추가</h3>

      {/* 1. 제목 */}
      <div className="flex flex-col gap-2">
        <label className="flex items-center gap-1.5 typo-caption-1 font-semibold text-foreground">
          <FileText size={15} className="text-blue" />
          제목
        </label>
        <input
          type="text"
          placeholder="일정 제목을 입력하세요."
          className="w-full px-4 py-3 rounded-xl neu-pressed outline-none typo-caption-2 text-foreground placeholder:text-place-h"
        />
      </div>

      {/* 2. 날짜 */}
      <div className="flex flex-col gap-2">
        <label className="flex items-center gap-1.5 typo-caption-1 font-semibold text-foreground">
          <Calendar size={15} className="text-blue" />
          날짜
        </label>
        <input
          type="text"
          defaultValue="2026. 06. 01."
          className="w-full px-4 py-3 rounded-xl neu-pressed outline-none typo-caption-2 text-foreground"
        />
      </div>

      {/* 3. 시간 */}
      <div className="flex flex-col gap-2">
        <label className="flex items-center gap-1.5 typo-caption-1 font-semibold text-foreground">
          <Clock size={15} className="text-blue" />
          시간
        </label>
        <div className="flex items-center gap-3">
          <input
            type="text"
            defaultValue="05:00"
            className="w-full px-4 py-2.5 rounded-xl neu-pressed outline-none typo-caption-2 text-center text-foreground"
          />
          <span className="text-secondary font-bold">~</span>
          <input
            type="text"
            defaultValue="00:00"
            className="w-full px-4 py-2.5 rounded-xl neu-pressed outline-none typo-caption-2 text-center text-foreground"
          />
        </div>
      </div>

      {/* 4. 카테고리 */}
      <div className="flex flex-col gap-2">
        <label className="flex items-center gap-1.5 typo-caption-1 font-semibold text-foreground">
          <Tag size={15} className="text-blue" />
          카테고리
        </label>
        <div className="grid grid-cols-4 gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategory(cat)}
              className={`py-2 rounded-xl text-xs font-semibold transition-all ${
                category === cat
                  ? "neu-pressed text-blue font-bold shadow-inner"
                  : "neu-btn text-secondary hover:text-foreground"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* 5. 메모 */}
      <div className="flex flex-col gap-2">
        <label className="flex items-center gap-1.5 typo-caption-1 font-semibold text-foreground">
          <Star size={15} className="text-amber-500 fill-amber-500" />
          메모
        </label>
        <textarea
          placeholder="일정 내용을 입력하세요."
          rows={4}
          className="w-full px-4 py-3 rounded-xl neu-pressed outline-none typo-caption-2 text-foreground placeholder:text-place-h resize-none"
        />
      </div>

      {/* 6. 하단 버튼 (취소 / 저장) */}
      <div className="flex gap-3 pt-2">
        <button
          type="button"
          className="flex-1 py-3 rounded-xl neu-btn text-foreground typo-caption-1 font-semibold transition-all hover:opacity-80"
        >
          취소
        </button>
        <button
          type="button"
          className="flex-1 py-3 rounded-xl bg-blue text-white typo-caption-1 font-semibold shadow-soft transition-all hover:opacity-90"
        >
          저장
        </button>
      </div>
    </div>
  );
}
