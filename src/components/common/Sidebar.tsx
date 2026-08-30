"use client";

import { Calendar, Home, Users, Settings } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();

  const menuItems = [
    { id: "home", label: "홈", icon: Home, path: "/" },
    { id: "calendar", label: "캘린더", icon: Calendar, path: "/schedule" },
    { id: "group", label: "그룹", icon: Users, path: "/group" },
    { id: "profile", label: "설정", icon: Settings, path: "/profile" },
  ];

  return (
    <aside
      className="
        fixed bottom-4 inset-x-4 py-1 z-40 h-fit rounded-2xl max-w-md mx-auto
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
                  relative
                  w-10 h-10
                  rounded-xl
                  flex items-center justify-center
                  transition-all duration-200
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
                {isActive && (
                  <span
                    className="
                      absolute bottom-0.5 sm:bottom-auto sm:top-0.5
                      left-1/2 -translate-x-1/2
                      h-1 w-1 rounded-full bg-primary
                    "
                  />
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
