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
    bg: "bg-primary-500/8",
    border: "border-primary-500",
    text: "text-primary-500",
    label: "bg-primary-500 text-white",
    hover:
      "hover:bg-primary-500/10 hover:border-primary-500 hover:text-primary-500",
  },

  work: {
    bg: "bg-success-500/8",
    border: "border-success-500",
    text: "text-success-500",
    label: "bg-success-500 text-white",
    hover:
      "hover:bg-success-500/10 hover:border-success-500 hover:text-success-500",
  },

  personal: {
    bg: "bg-pending-500/8",
    border: "border-pending-500",
    text: "text-pending-500",
    label: "bg-pending-500 text-white",
    hover:
      "hover:bg-pending-500/10 hover:border-pending-500 hover:text-pending-500",
  },

  important: {
    bg: "bg-error-500/8",
    border: "border-error-500",
    text: "text-error-500",
    label: "bg-error-500 text-white",
    hover: "hover:bg-error-500/10 hover:border-error-500 hover:text-error-500",
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
