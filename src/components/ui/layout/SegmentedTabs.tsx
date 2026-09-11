"use client";

import { motion } from "motion/react";

import { springGlide } from "@/src/lib/motion";
import { cn } from "@/src/utils/cn";

type Tab<T extends string> = {
  key: T;
  label: string;
  shortLabel?: string;
  icon?: React.ReactNode;
  badge?: number;
  disabled?: boolean;
  title?: string;
};

type SegmentedTabsProps<T extends string> = {
  tabs: Tab<T>[];
  value: T;
  onChange: (key: T) => void;
  label: string;
  fit?: boolean;
  className?: string;
};

export default function SegmentedTabs<T extends string>({
  tabs,
  value,
  onChange,
  label,
  fit = false,
  className,
}: SegmentedTabsProps<T>) {
  return (
    <div
      role="tablist"
      aria-label={label}
      className={cn(
        "neu-pressed relative flex rounded-xl p-1",
        fit ? "w-fit" : "w-full",
        className,
      )}
    >
      {tabs.map((tab) => (
        <button
          key={tab.key}
          type="button"
          role="tab"
          aria-selected={value === tab.key}
          disabled={tab.disabled}
          title={tab.title}
          onClick={() => !tab.disabled && onChange(tab.key)}
          className={cn(
            `
            relative
            flex
            items-center
            justify-center
            gap-1.5
            rounded-lg
            typo-caption-2
            font-semibold
            whitespace-nowrap
            transition-colors
            duration-200

            focus-visible:outline-none
            focus-visible:ring-2
            focus-visible:ring-accent/60
            disabled:cursor-not-allowed disabled:opacity-40
            `,
            fit ? "px-4 py-1.5" : "h-9 flex-1",
            value === tab.key ? "text-accent" : "text-secondary",
          )}
        >
          {value === tab.key && (
            <motion.span
              aria-hidden="true"
              layoutId={`segmented-tabs-${label}`}
              transition={springGlide}
              className="neu-flat absolute inset-0 rounded-lg"
            />
          )}

          <span className="relative z-10 flex items-center gap-1.5">
            {tab.icon}
            {tab.shortLabel ? (
              <>
                <span className="max-[359px]:hidden">{tab.label}</span>
                <span className="min-[360px]:hidden">{tab.shortLabel}</span>
              </>
            ) : (
              tab.label
            )}
            {!!tab.badge && (
              <span
                className={cn(
                  "ml-0.5 min-w-5 rounded-full px-1.5 py-px text-[10px] font-bold leading-4 tabular-nums",
                  value === tab.key
                    ? "bg-accent text-on-primary"
                    : "bg-surface-hover text-secondary",
                )}
              >
                {tab.badge > 99 ? "99+" : tab.badge}
              </span>
            )}
          </span>
        </button>
      ))}
    </div>
  );
}
