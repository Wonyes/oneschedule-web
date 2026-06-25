"use client";

import {
  LayoutGrid,
  Calendar,
  FileText,
  Cloud,
  Flame,
  Users,
  MessageSquare,
  Settings,
} from "lucide-react";

const menus = [
  { icon: LayoutGrid, label: "대쉬보드", active: true },
  { icon: Calendar, label: "Calendar" },
  { icon: FileText, label: "Invoice" },
  { icon: Cloud, label: "Files" },
  { icon: Flame, label: "Events" },
  { icon: Users, label: "Teams" },
  { icon: MessageSquare, label: "Message" },
  { icon: Settings, label: "Settings" },
];

export default function Sidebar() {
  return (
    <div className="mt-8 grid h-fit w-fit grid-cols-2 border border-b-color">
      {menus.map(({ icon: Icon, label, active }, i) => (
        <div
          key={label}
          className={`
        relative flex h-[120px] w-[120px]
        items-center justify-center

        ${i % 2 === 0 ? "border-r" : ""}
        ${i < menus.length - 2 ? "border-b" : ""}
        border-b-color
      `}
        >
          <button
            className={`
              absolute flex flex-col items-center justify-center gap-2
              transition-all duration-300
               hover:shadow-float 
          ${
            active
              ? `
              -left-[5px]
              -top-[5px]
              h-[130px]
              w-[130px]
              surface
              shadow-float
              z-20
              `
              : `
              inset-0
              `
          }
        `}
          >
            <Icon
              size={18}
              className={active ? "text-title" : "text-place-h"}
            />

            <span
              className={`typo-body-2 ${
                active ? "text-title" : "text-place-h"
              }`}
            >
              {label}
            </span>

            {active && (
              <span className="absolute right-5 top-5 size-2 rounded-full bg-orange-500" />
            )}
          </button>
        </div>
      ))}
    </div>
  );
}
