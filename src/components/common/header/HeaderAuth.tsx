"use client";

import { LogIn, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

import { MyInfoResponse, useLogout } from "@/src/hooks/querys/useMembers";
import { Primary } from "../../ui/layout/button";

export default function HeaderAuth({ user }: { user: MyInfoResponse | null }) {
  const router = useRouter();
  const { mutate: logout } = useLogout();

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  if (!user) {
    return (
      <Primary
        onClick={() => router.push("/login")}
        icon={<LogIn size={13} strokeWidth={1.75} />}
        text="로그인"
        className="h-8 gap-1.5 px-3.5 py-0 typo-caption-2 whitespace-nowrap"
      />
    );
  }

  return (
    <div className="flex items-center gap-1.5">
      <div
        onClick={() => router.push("/profile")}
        className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg cursor-pointer btn-spring hover:bg-white/5"
      >
        <span className="h-6 w-6 shrink-0 rounded-full bg-accent/15 text-accent typo-caption-3 font-bold flex items-center justify-center">
          {user.nickname[0]}
        </span>
        <span className="typo-caption-2 text-secondary max-w-[40px] truncate lg:max-w-none">
          {user.nickname}
        </span>
      </div>

      <button
        onClick={handleLogout}
        className="p-1.5 rounded-lg text-muted btn-spring hover:bg-white/5 hover:text-foreground active:scale-95"
      >
        <LogOut size={15} strokeWidth={1.75} />
      </button>
    </div>
  );
}
