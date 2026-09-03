"use client";

import { LogIn, LogOut } from "lucide-react";
import IconBox from "../../ui/IconBox";
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
      <button
        type="button"
        onClick={() => router.push("/profile")}
        aria-label="내 프로필"
        className="btn-spring flex cursor-pointer items-center gap-2 rounded-lg p-1 hover:bg-white/5 lg:px-2.5 lg:py-1.5"
      >
        <IconBox size="sm" shape="circle" className="typo-caption-3 font-bold">
          {user.nickname[0]}
        </IconBox>
        <span className="typo-caption-2 text-secondary hidden lg:inline">
          {user.nickname}
        </span>
      </button>

      <button
        onClick={handleLogout}
        aria-label="로그아웃"
        className="p-1.5 rounded-xl neu-flat text-muted btn-spring hover:bg-white/5 hover:text-foreground active:scale-95"
      >
        <LogOut size={15} strokeWidth={1.75} />
      </button>
    </div>
  );
}
