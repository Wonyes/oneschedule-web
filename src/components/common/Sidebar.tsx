"use client";

import { Home, Calendar, Users, Settings } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Sidebar() {
  const router = useRouter();

  const menuItems = [
    { id: "home", label: "홈", icon: Home, path: "/" },
    { id: "calendar", label: "캘린더", icon: Calendar, path: "/" },
    { id: "group", label: "그룹", icon: Users, path: "/group" },
    { id: "profile", label: "설정", icon: Settings, path: "/profile" },
  ];

  return (
    <aside
      className="
        w-16 h-full
        neu-flat
        flex flex-col items-center justify-between
        py-5 shrink-0
        select-none
        rounded-2xl
      "
    >
      <div className="flex flex-col items-center gap-6">
        <nav className="flex flex-col gap-3">
          {menuItems.map((item) => {
            const Icon = item.icon;

            return (
              <button
                key={item.id}
                onClick={() => router.push(item.path)}
                title={item.label}
                className="
                  w-10 h-10
                  rounded-xl
                  flex items-center justify-center
                  transition-all
                  neu-btn
                  text-secondarty
                  hover:text-foreground
                  group
                "
              >
                <Icon
                  size={18}
                  className="
                    transition-transform
                    group-hover:scale-110
                  "
                />
              </button>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
