"use client";

import { cn } from "@/src/utils/cn";

type Tab<T extends string> = {
  key: T;
  label: string;
  icon?: React.ReactNode;
};

type SegmentedTabsProps<T extends string> = {
  tabs: Tab<T>[];
  value: T;
  onChange: (key: T) => void;
  label: string;
  className?: string;
};

export default function SegmentedTabs<T extends string>({
  tabs,
  value,
  onChange,
  label,
  className,
}: SegmentedTabsProps<T>) {
  const activeIndex = Math.max(
    tabs.findIndex((tab) => tab.key === value),
    0,
  );

  return (
    <div
      role="tablist"
      aria-label={label}
      className={cn(
        "neu-pressed relative flex w-full rounded-xl p-1",
        className,
      )}
    >
      <div
        aria-hidden="true"
        className="neu-flat absolute inset-y-1 left-1 rounded-lg transition-transform duration-300"
        style={{
          width: `calc(${100 / tabs.length}% - ${8 / tabs.length}px)`,
          transform: `translateX(${activeIndex * 100}%)`,
        }}
      />

      {tabs.map((tab) => (
        <button
          key={tab.key}
          type="button"
          role="tab"
          aria-selected={value === tab.key}
          onClick={() => onChange(tab.key)}
          className={cn(
            `
            relative
            z-10
            flex
            h-9
            flex-1
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
            `,
            value === tab.key ? "text-accent" : "text-secondary",
          )}
        >
          {tab.icon}
          {tab.label}
        </button>
      ))}
    </div>
  );
}
