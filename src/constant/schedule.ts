import { ScheduleEvent } from "../types/schedule";

const HOUR_HEIGHT = 56;

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

const EVENT_STYLES = {
  meeting: {
    bg: "bg-[#e5ede7]/80 ",
    border:
      "border border-[#2f855a]/20 shadow-[inset_2px_2px_5px_rgba(255,255,255,0.7),2px_2px_6px_rgba(130,150,135,0.15)]",
    text: "text-[#2f855a]",
    label: "bg-[#2f855a] text-white font-medium",
    dot: "bg-[#2f855a]",
    hover: "hover:border-[#2f855a]/50",
  },

  work: {
    bg: "bg-[#e4ece9]/80 ",
    border:
      "border border-[#319795]/20 shadow-[inset_2px_2px_5px_rgba(255,255,255,0.7),2px_2px_6px_rgba(130,150,135,0.15)]",
    text: "text-[#319795]",
    label: "bg-[#319795] text-white font-medium",
    dot: "bg-[#319795]",
    hover: "hover:border-[#319795]/50",
  },

  personal: {
    bg: "bg-[#f4f2e6]/80 ",
    border:
      "border border-[#d69e2e]/20 shadow-[inset_2px_2px_5px_rgba(255,255,255,0.7),2px_2px_6px_rgba(130,150,135,0.15)]",
    text: "text-[#d69e2e]",
    label: "bg-[#d69e2e] text-white font-medium",
    dot: "bg-[#d69e2e]",
    hover: "hover:border-[#d69e2e]/50",
  },

  important: {
    bg: "bg-[#f5e6e6]/80 ",
    border:
      "border border-[#e53e3e]/20 shadow-[inset_2px_2px_5px_rgba(255,255,255,0.7),2px_2px_6px_rgba(130,150,135,0.15)]",
    text: "text-[#e53e3e]",
    label: "bg-[#e53e3e] text-white font-medium",
    dot: "bg-[#e53e3e]",
    hover: "hover:border-[#e53e3e]/50",
  },
} as const;

const dummyEvents: ScheduleEvent[] = [
  {
    id: 1,
    title: "Frontend Meeting",
    startDate: "2026-07-16T11:00:00",
    endDate: "2026-07-16T13:00:00",
    category: "meeting",
  },
  {
    id: 2,
    title: "Project Work",
    startDate: "2026-07-15T09:30:00",
    endDate: "2026-07-15T11:30:00",
    category: "work",
  },
  {
    id: 3,
    title: "Gym",
    startDate: "2026-07-08T18:00:00",
    endDate: "2026-07-19T19:30:00",
    category: "personal",
  },
  {
    id: 4,
    title: "Test",
    startDate: "2026-07-08T18:00:00",
    endDate: "2026-07-19T19:30:00",
    category: "personal",
  },
  {
    id: 5,
    title: "Test",
    startDate: "2026-07-08T18:00:00",
    endDate: "2026-07-19T19:30:00",
    category: "personal",
  },
];

export { HOUR_HEIGHT, DAYS, HOURS, EVENT_STYLES, dummyEvents };
