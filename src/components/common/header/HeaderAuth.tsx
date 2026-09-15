"use client";

import AvatarImage from "@/src/components/common/AvatarImage";
import { LogIn, LogOut } from "lucide-react";
import IconBox from "../../ui/IconBox";
import Link from "next/link";

import { MyInfoResponse, useLogout } from "@/src/hooks/querys/useMembers";
import { Primary } from "../../ui/layout/button";

export default function HeaderAuth({ user }: { user: MyInfoResponse | null }) {
  const { mutate: logout } = useLogout();

  if (!user) {
    return (
      <Primary
        href="/login"
        icon={<LogIn size={13} strokeWidth={1.75} />}
        text="로그인"
        className="h-9 gap-1.5 px-3.5 py-0 typo-caption-2 whitespace-nowrap"
      />
    );
  }

  return (
    <div className="flex items-center gap-3">
      <Link
        href="/profile"
        prefetch
        aria-label="내 프로필"
        className="btn-spring flex h-9 cursor-pointer items-center gap-2 rounded-lg hover:bg-surface-hover"
      >
        <IconBox
          size="header"
          shape="circle"
          className="overflow-hidden typo-caption-3 font-bold"
        >
          <AvatarImage src={user.profileImageUrl} nickname={user.nickname} />
        </IconBox>
        <span className="typo-caption-2 text-secondary hidden min-[1360px]:inline">
          {user.nickname}
        </span>
      </Link>

      <button
        onClick={() => logout()}
        aria-label="로그아웃"
        className="hidden h-9 w-9 items-center justify-center rounded-full neu-flat text-muted btn-spring hover:bg-surface-hover hover:text-foreground active:scale-95 lg:flex"
      >
        <LogOut size={15} strokeWidth={1.75} />
      </button>
    </div>
  );
}
