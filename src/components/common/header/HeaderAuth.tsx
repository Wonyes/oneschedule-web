"use client";

import { LogIn, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

import { useLogout, useMyInfo } from "@/src/hooks/querys/useMembers";
import UserAvatar from "../../ui/avatar";
import AuthSkeleton from "./AuthSkeleton";

export default function HeaderAuth({ hasToken }: { hasToken: boolean }) {
  const router = useRouter();
  const { mutate: logout } = useLogout();
  const { data: user, isLoading } = useMyInfo(hasToken);

  if (!hasToken) {
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
        "
      >
        <LogIn size={14} />
        로그인
      </button>
    );
  }

  if (isLoading || !user) {
    return <AuthSkeleton />;
  }

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl neu-flat">
        <UserAvatar
          name={user.name}
          nickname={user.nickname}
          className="w-6 h-6"
        />

        <span className="typo-caption-2 font-semibold">{user.nickname}</span>
      </div>

      <button
        onClick={() => logout()}
        className="p-2 rounded-xl neu-pressed text-slate-400"
      >
        <LogOut size={16} />
      </button>
    </div>
  );
}
