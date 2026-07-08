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
  },

  work: {
    bg: "bg-success-500/8",
    border: "border-success-500",
    text: "text-success-500",
    label: "bg-success-500 text-white",
  },

  personal: {
    bg: "bg-pending-500/8",
    border: "border-pending-500",
    text: "text-pending-500",
    label: "bg-pending-500 text-white",
  },

  important: {
    bg: "bg-error-500/8",
    border: "border-error-500",
    text: "text-error-500",
    label: "bg-error-500 text-white",
  },

  default: {
    bg: "bg-surface",
    border: "border-divider",
    text: "text-muted",
    label: "bg-divider text-t-title",
  },
} as const;

export { HOUR_HEIGHT, DAYS, HOURS, EVENT_STYLES };
