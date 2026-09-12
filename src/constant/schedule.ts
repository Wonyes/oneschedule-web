const HOURS = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, "0"));

const EVENT_STYLES = {
  meeting: {
    border: "border border-[#2f855a]/30",
    label: "bg-[#2f855a] text-on-primary font-medium",
    dot: "bg-[#2f855a]",
    chip: "bg-[#2f855a]/12 text-[#2f855a] border-[#2f855a]/45",
  },

  work: {
    border: "border border-[#319795]/30",
    label: "bg-[#319795] text-on-primary font-medium",
    dot: "bg-[#319795]",
    chip: "bg-[#319795]/12 text-[#319795] border-[#319795]/45",
  },

  personal: {
    border: "border border-[#d69e2e]/30",
    label: "bg-[#d69e2e] text-on-primary font-medium",
    dot: "bg-[#d69e2e]",
    chip: "bg-[#d69e2e]/12 text-[#d69e2e] border-[#d69e2e]/45",
  },

  important: {
    border: "border border-[#e53e3e]/30",
    label: "bg-[#e53e3e] text-on-primary font-medium",
    dot: "bg-[#e53e3e]",
    chip: "bg-[#e53e3e]/12 text-[#e53e3e] border-[#e53e3e]/45",
  },
} as const;

export { HOURS, EVENT_STYLES };
