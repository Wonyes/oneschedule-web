const HOURS = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, "0"));

/** 카테고리 색은 globals.css의 --cat-* 토큰. 글자색(-text)만 테마별로 다르다 */
const EVENT_STYLES = {
  meeting: {
    border: "border border-cat-meeting/30",
    label: "bg-cat-meeting text-on-primary font-medium",
    dot: "bg-cat-meeting",
    chip: "bg-cat-meeting/12 text-cat-meeting-text border-cat-meeting/45",
  },

  work: {
    border: "border border-cat-work/30",
    label: "bg-cat-work text-on-primary font-medium",
    dot: "bg-cat-work",
    chip: "bg-cat-work/12 text-cat-work-text border-cat-work/45",
  },

  personal: {
    border: "border border-cat-personal/30",
    label: "bg-cat-personal text-on-primary font-medium",
    dot: "bg-cat-personal",
    chip: "bg-cat-personal/12 text-cat-personal-text border-cat-personal/45",
  },

  important: {
    border: "border border-cat-important/30",
    label: "bg-cat-important text-on-primary font-medium",
    dot: "bg-cat-important",
    chip: "bg-cat-important/12 text-cat-important-text border-cat-important/45",
  },
} as const;

export { HOURS, EVENT_STYLES };
