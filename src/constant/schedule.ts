const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
] as const;

const HOURS = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, "0"));

// 카테고리별 브랜드 색. 테마와 무관하게 고정이므로 CSS 변수가 아닌 리터럴을 쓴다.
// border/label은 시트의 카테고리 칩 선택 상태, dot은 일정 카드의 색 점에 쓰인다.
const EVENT_STYLES = {
  meeting: {
    border: "border border-[#2f855a]/30",
    label: "bg-[#2f855a] text-white font-medium",
    dot: "bg-[#2f855a]",
  },

  work: {
    border: "border border-[#319795]/30",
    label: "bg-[#319795] text-white font-medium",
    dot: "bg-[#319795]",
  },

  personal: {
    border: "border border-[#d69e2e]/30",
    label: "bg-[#d69e2e] text-white font-medium",
    dot: "bg-[#d69e2e]",
  },

  important: {
    border: "border border-[#e53e3e]/30",
    label: "bg-[#e53e3e] text-white font-medium",
    dot: "bg-[#e53e3e]",
  },
} as const;

export { DAYS, HOURS, EVENT_STYLES };
