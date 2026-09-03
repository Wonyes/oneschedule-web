"use client";

import AccountInfo from "@/src/components/schedule/components/profile/AccountInfo";
import ProfileActions from "@/src/components/schedule/components/profile/ProfileActions";
import ProfileCard from "@/src/components/schedule/components/profile/ProfileCard";
import BaseCard from "@/src/components/ui/card/BaseCard";

import { useMyInfo } from "@/src/hooks/querys/useMembers";

export default function ProfilePage() {
  const { data: user, isPending, isError } = useMyInfo();

  if (isPending) {
    return (
      <main className="mx-auto w-full max-w-[860px] px-1 py-1">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start">
          <div className="h-[300px] w-full rounded-[var(--radius-outer)] neu-flat animate-pulse lg:w-[320px] lg:shrink-0" />
          <div className="h-[340px] w-full rounded-[var(--radius-outer)] neu-flat animate-pulse" />
        </div>
      </main>
    );
  }

  if (isError || !user) {
    return (
      <main className="mx-auto w-full max-w-[420px]">
        <BaseCard className="p-8" glow>
          <p className="typo-sub-t-2 text-foreground">
            사용자 정보를 불러오지 못했습니다.
          </p>
          <p className="typo-caption-2 text-muted mt-1">
            잠시 후 다시 시도해 주세요.
          </p>
        </BaseCard>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-[860px] px-1 py-1">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start">
        <div className="flex w-full flex-col gap-3 lg:w-[320px] lg:shrink-0">
          <ProfileCard user={user} />
          <ProfileActions />
        </div>

        <div className="min-w-0 flex-1">
          <AccountInfo user={user} />
        </div>
      </div>
    </main>
  );
}
