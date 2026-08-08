"use client";

import { cn } from "@/src/utils/cn";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

export type DropdownOption = {
  label: string;
  value: string;
};

type DropdownProps = {
  value: string;
  options: DropdownOption[];
  onChange: (value: string) => void;
  placeholder?: string;
};

export default function Dropdown({
  value,
  options,
  onChange,
  placeholder = "선택",
}: DropdownProps) {
  const [open, setOpen] = useState(false);

  const selected = options.find((option) => option.value === value);

  return (
    <div className="relative w-full neu-pressed rounded-xl">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between px-4 py-3"
      >
        <span className="typo-caption-2">{selected?.label ?? placeholder}</span>

        <ChevronDown
          size={16}
          className={cn("transition", open && "rotate-180")}
        />
      </button>

      {open && (
        <div className="neu-pressed absolute top-14 z-50 w-full rounded-xl p-1">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                onChange(option.value);
                setOpen(false);
              }}
              className="
                w-full rounded-xl px-3 py-2
                text-left typo-caption-2
                hover:bg-slate-800
              "
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
