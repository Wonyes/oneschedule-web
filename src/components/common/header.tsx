"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useScheduleStore } from "@/src/hooks/stores/useScheduleStore";
import { useLoginStore } from "@/src/hooks/stores/useLoginStore";
import { LogIn, LogOut } from "lucide-react";

export default function Header() {
  const [activeTab, setActiveTab] = useState<"my" | "group">("my");
  const { isLogin } = useLoginStore();
  const { mode, setMode } = useScheduleStore();
  const router = useRouter();

  const user = {
    nickname: "영우노인네",
    profileImage: "",
  };

  const logout = () => {
    localStorage.removeItem("access-token");
    localStorage.removeItem("refresh-token");
    window.location.href = "/";
  };

  return (
    <header className="grid grid-cols-3 items-center px-4 py-3 text-slate-800 shrink-0">
      {/* 1. 좌측: 로고 */}
      <div className="flex justify-start">
        <h1 className="tracking-tighter">
          <img
            className="h-9 w-auto cursor-pointer drop-shadow-sm"
            src="/assets/schedule_logo.png"
            alt="logo"
            onClick={() => router.push("/")}
          />
        </h1>
      </div>

      {/* 2. 중앙: 슬라이딩 탭 메뉴 (MY / GROUP) */}
      <nav className="relative flex rounded-xl neu-pressed p-1.5 items-center w-[280px] justify-self-center">
        <div
          className={`absolute top-1.5 bottom-1.5 w-[calc(50%-6px)] neu-flat rounded-lg transition-transform duration-300 ease-in-out ${
            activeTab === "my" ? "translate-x-0" : "translate-x-full"
          }`}
        />
        <button
          onClick={() => setActiveTab("my")}
          className={`relative z-10 w-1/2 text-center text-xs font-semibold py-2 transition-colors duration-200 ${
            activeTab === "my"
              ? "text-blue"
              : "text-secondarty hover:text-foreground"
          }`}
        >
          MY Schedule
        </button>
        <button
          onClick={() => setActiveTab("group")}
          className={`relative z-10 w-1/2 text-center text-xs font-semibold py-2 transition-colors duration-200 ${
            activeTab === "group"
              ? "text-blue"
              : "text-secondarty hover:text-foreground"
          }`}
        >
          GROUP Schedule
        </button>
      </nav>

      {/* 3. 우측: 일/주/월 슬라이딩 토글 + 유저 프로필 */}
      <div className="flex items-center gap-3 justify-end">
        {/* 일 / 주 / 월 슬라이딩 토글 (스토어 연동) */}
        <div className="relative flex rounded-xl neu-pressed p-1.5 items-center w-[138px]">
          <div
            className={`absolute top-1.5 bottom-1.5 w-[calc(33.333%-4px)] neu-flat rounded-lg transition-transform duration-300 ease-in-out ${
              mode === "day"
                ? "translate-x-0"
                : mode === "week"
                  ? "translate-x-full"
                  : "translate-x-[200%]"
            }`}
          />
          {(["day", "week", "month"] as const).map((viewModeOption) => {
            const labels = { day: "일", week: "주", month: "월" };
            return (
              <button
                key={viewModeOption}
                onClick={() => setMode(viewModeOption)}
                className={`relative z-10 w-1/3 text-center text-xs font-semibold py-1.5 transition-colors duration-200 ${
                  mode === viewModeOption
                    ? "text-blue"
                    : "text-secondarty hover:text-foreground"
                }`}
              >
                {labels[viewModeOption]}
              </button>
            );
          })}
        </div>

        {isLogin ? (
          <div className="flex items-center gap-2">
            {/* 유저 프로필 칩 */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl neu-flat">
              <Avatar className="w-6 h-6 rounded-md">
                <AvatarImage src={user.profileImage} alt={user.nickname} />
                <AvatarFallback className="bg-transparent text-slate-200 text-[10px] font-bold">
                  {user.nickname[0]}
                </AvatarFallback>
              </Avatar>
              <span className="text-xs font-semibold text-slate-200">
                {user.nickname}
              </span>
            </div>

            {/* 로그아웃 버튼 */}
            <button
              onClick={logout}
              className="p-2 rounded-xl neu-pressed text-slate-400 hover:text-red-400 transition-colors"
              title="로그아웃"
            >
              <LogOut size={16} />
            </button>
          </div>
        ) : (
          /* 비로그인 상태: 로그인 버튼 */
          <button
            onClick={() => router.push("/login")}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30 hover:bg-indigo-500 transition-all"
          >
            <LogIn size={14} />
            로그인
          </button>
        )}
      </div>
    </header>
  );
}
