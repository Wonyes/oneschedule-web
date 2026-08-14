"use client";

import { Calendar, Users, Settings } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();

  const menuItems = [
    { id: "calendar", label: "캘린더", icon: Calendar, path: "/" },
    { id: "group", label: "그룹", icon: Users, path: "/group" },
    { id: "profile", label: "설정", icon: Settings, path: "/profile" },
  ];

  return (
    <aside
      className="
        fixed bottom-4 inset-x-4 z-40 h-16 rounded-2xl max-w-md mx-auto
        sm:static sm:inset-x-auto sm:bottom-auto sm:w-16 sm:h-full sm:max-w-none sm:mx-0
        glass sm:neu-flat
        flex flex-row sm:flex-col items-center justify-around sm:justify-between
        py-0 sm:py-5 shrink-0
        select-none
      "
    >
      <div className="flex flex-row sm:flex-col items-center justify-around sm:justify-start gap-0 sm:gap-6 w-full sm:w-auto">
        <nav className="flex flex-row sm:flex-col justify-around sm:justify-start gap-0 sm:gap-3 w-full sm:w-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.path === "/"
                ? pathname === "/"
                : pathname.startsWith(item.path);

            return (
              <button
                key={item.id}
                onClick={() => router.push(item.path)}
                title={item.label}
                aria-current={isActive ? "page" : undefined}
                className={`
                  w-10 h-10
                  rounded-xl
                  flex items-center justify-center
                  transition-all
                  active:scale-95
                  group
                  ${
                    isActive
                      ? "neu-pressed text-primary"
                      : "neu-btn text-secondary hover:text-foreground"
                  }
                `}
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
