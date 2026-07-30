"use client";

import { useState } from "react";
import { Home, Calendar, Users, Settings } from "lucide-react";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

export default function Sidebar() {
  const router = useRouter();
  const [activeMenu, setActiveMenu] = useState("calendar");

  const menuItems = [
    { id: "home", label: "홈", icon: Home, path: "/" },
    { id: "calendar", label: "캘린더", icon: Calendar, path: "/" },
    { id: "group", label: "그룹", icon: Users, path: "/group" },
    { id: "settings", label: "설정", icon: Settings, path: "/settings" },
  ];

  const user = {
    nickname: "김영우",
    profileImage: "",
  };

  return (
    <aside className="w-16 h-full neu-flat flex flex-col items-center justify-between py-5 shrink-0 select-none rounded-2xl">
      {/* 1. 상단: 유저 프로필 아바타 */}
      <div className="flex flex-col items-center gap-6">
        <div className="w-9 h-9 rounded-xl neu-pressed flex items-center justify-center cursor-pointer overflow-hidden p-0.5 transition-transform hover:scale-105">
          <Avatar className="w-full h-full rounded-lg">
            <AvatarImage src={user.profileImage} alt={user.nickname} />
            <AvatarFallback className="bg-transparent text-foreground text-[10px] font-bold">
              {user.nickname[0]}
            </AvatarFallback>
          </Avatar>
        </div>

        {/* 2. 중단: 메인 아이콘 네비게이션 */}
        <nav className="flex flex-col gap-3">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeMenu === item.id;

            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveMenu(item.id);
                  router.push(item.path);
                }}
                title={item.label}
                className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all group ${
                  isActive
                    ? "neu-pressed text-blue font-bold shadow-inner"
                    : "neu-btn text-secondarty hover:text-foreground"
                }`}
              >
                <Icon
                  size={18}
                  className="transition-transform group-hover:scale-110"
                />
              </button>
            );
          })}
        </nav>
      </div>

      {/* 3. 하단: 프로필 아바타 및 N 뱃지 */}
      <div className="flex flex-col items-center gap-2.5">
        <div className="w-9 h-9 rounded-xl neu-pressed flex items-center justify-center cursor-pointer overflow-hidden p-0.5">
          <Avatar className="w-full h-full rounded-lg">
            <AvatarImage src={user.profileImage} alt={user.nickname} />
            <AvatarFallback className="bg-transparent text-foreground text-[10px] font-bold">
              {user.nickname[0]}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </aside>
  );
}
