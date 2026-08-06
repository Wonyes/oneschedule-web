"use client";

import AccountInfo from "@/src/components/schedule/components/profile/AccountInfo";
import ProfileActions from "@/src/components/schedule/components/profile/ProfileActions";
import ProfileCard from "@/src/components/schedule/components/profile/ProfileCard";
import BaseCard from "@/src/components/ui/card/BaseCard";

import { useMyInfo } from "@/src/hooks/querys/useMembers";

export default function ProfilePage() {
  const { data: user, isLoading, isError } = useMyInfo();

  if (isLoading) {
    return (
      <main className="max-w-[420px] mx-auto flex flex-col gap-5">
        <div className="h-[220px] rounded-[32px] neu-flat animate-pulse" />

        <div className="h-[280px] rounded-[32px] neu-flat animate-pulse" />
      </main>
    );
  }

  if (isError || !user) {
    return (
      <main className="max-w-[420px] mx-auto">
        <BaseCard className="p-8" glow>
          <p className="text-slate-300">사용자 정보를 불러오지 못했습니다.</p>
        </BaseCard>
      </main>
    );
  }

  return (
    <main className="max-w-[420px] mx-auto flex flex-col gap-5">
      <ProfileCard user={user} />

      <AccountInfo user={user} />

      <ProfileActions />
    </main>
  );
}
