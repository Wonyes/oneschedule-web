"use client";

import { LogIn, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

import { MyInfoResponse, useLogout } from "@/src/hooks/querys/useMembers";

export default function HeaderAuth({ user }: { user: MyInfoResponse | null }) {
  const router = useRouter();
  const { mutate: logout } = useLogout();

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  if (!user) {
    return (
      <button
        onClick={() => router.push("/login")}
        className="
          flex items-center gap-1.5
          px-4 py-2
          rounded-xl
          bg-indigo-600
          text-white
          typo-caption-2
          whitespace-nowrap
        "
      >
        <LogIn size={14} />
        로그인
      </button>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <div
        onClick={() => router.push("/profile")}
        className="flex items-center gap-2 px-2.5 lg:px-3 py-2 rounded-xl neu-pressed cursor-pointer"
      >
        <span className="typo-caption-2 max-w-[40px] truncate lg:max-w-none">
          {user.nickname}
        </span>
      </div>

      <button
        onClick={handleLogout}
        className="p-2 rounded-xl neu-pressed text-slate-400"
      >
        <LogOut size={16} />
      </button>
    </div>
  );
}
