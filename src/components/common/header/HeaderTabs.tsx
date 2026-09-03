"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { useScheduleViewStore } from "@/src/hooks/stores/useScheduleViewStore";
import { useActiveGroup } from "@/src/hooks/querys/useGroup";
import { ScheduleViewType } from "@/src/types/schedule";
import GroupSwitcher from "../../group/GroupSwitcher";

const TABS = [
  { key: "PERSONAL", label: "MY Schedule" },
  { key: "GROUP", label: "GROUP Schedule" },
] as const;

type TabKey = (typeof TABS)[number]["key"];

export default function HeaderTabs() {
  const { viewType, setViewType } = useScheduleViewStore();
  const pathname = usePathname();

  const isSchedulePage = pathname === "/schedule";
  const { groups } = useActiveGroup(isSchedulePage);
  const hasGroup = groups.length > 0;

  const navRef = useRef<HTMLElement>(null);
  const btnRefs = useRef<Partial<Record<TabKey, HTMLButtonElement | null>>>({});
  const [indicator, setIndicator] = useState({ left: 0, width: 0 });

  useEffect(() => {
    const nav = navRef.current;
    const btn = btnRefs.current[viewType];

    if (nav && btn) {
      const navRect = nav.getBoundingClientRect();
      const btnRect = btn.getBoundingClientRect();

      setIndicator({
        left: btnRect.left - navRect.left,
        width: btnRect.width,
      });
    }
  }, [viewType]);

  if (!isSchedulePage) {
    return null;
  }

  return (
    <div className="relative flex items-center">
      <nav ref={navRef} className="relative flex rounded-xl neu-pressed p-1">
        <span
          className="absolute inset-y-1 rounded-lg neu-flat transition-all duration-300 ease-out"
          style={{ left: indicator.left, width: indicator.width }}
        />

        {TABS.map(({ key, label }) => {
          const disabled = key === "GROUP" && !hasGroup;

          return (
            <button
              key={key}
              ref={(el) => {
                btnRefs.current[key] = el;
              }}
              onClick={() => !disabled && setViewType(key as ScheduleViewType)}
              disabled={disabled}
              title={disabled ? "소속된 그룹이 없어요" : undefined}
              className={`
                relative z-10 px-4 py-1.5 typo-caption-2 font-semibold whitespace-nowrap
                transition-colors
                disabled:cursor-not-allowed disabled:opacity-40
                ${viewType === key ? "text-accent" : "text-secondary"}
              `}
            >
              {label}
            </button>
          );
        })}
      </nav>

      <div className="absolute left-full top-1/2 ml-1 hidden -translate-y-1/2 lg:block">
        <GroupSwitcher />
      </div>
    </div>
  );
}
