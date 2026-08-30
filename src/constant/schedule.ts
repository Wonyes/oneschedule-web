import { addDays, format } from "date-fns";
import { ScheduleEvent } from "../types/schedule";

const at = (dayOffset: number, hour: number, minute = 0) => {
  const date = addDays(new Date(), dayOffset);
  date.setHours(hour, minute, 0, 0);
  return format(date, "yyyy-MM-dd'T'HH:mm:ss");
};

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
    startDate: at(0, 11, 0),
    endDate: at(0, 13, 0),
    category: "meeting",
  },
  {
    id: 2,
    title: "Project Work",
    startDate: at(1, 9, 30),
    endDate: at(1, 11, 30),
    category: "work",
  },
  {
    id: 3,
    title: "Gym",
    startDate: at(2, 18, 0),
    endDate: at(2, 19, 30),
    category: "personal",
  },
  {
    id: 4,
    title: "Team Sync",
    startDate: at(3, 14, 0),
    endDate: at(3, 15, 0),
    category: "meeting",
  },
  {
    id: 5,
    title: "1:1",
    startDate: at(4, 16, 0),
    endDate: at(4, 16, 30),
    category: "work",
  },
];

export { DAYS, HOURS, EVENT_STYLES, dummyEvents };
