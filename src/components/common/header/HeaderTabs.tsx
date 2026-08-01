"use client";

import { useState } from "react";

export default function HeaderTabs() {
  const [activeTab, setActiveTab] = useState<"my" | "group">("my");

  return (
    <nav className="relative flex rounded-xl neu-pressed p-1.5 w-[280px] justify-self-center">
      <div
        className={`
          absolute top-1.5 bottom-1.5
          w-[calc(50%-6px)]
          neu-flat rounded-lg
          transition-transform
          duration-300
          ${activeTab === "my" ? "translate-x-0" : "translate-x-full"}
        `}
      />

      {(["my", "group"] as const).map((tab) => (
        <button
          key={tab}
          onClick={() => setActiveTab(tab)}
          className={`
            relative z-10
            w-1/2 py-2
            typo-caption-2
            ${activeTab === tab ? "text-blue" : "text-secondarty"}
          `}
        >
          {tab === "my" ? "MY Schedule" : "GROUP Schedule"}
        </button>
      ))}
    </nav>
  );
}
