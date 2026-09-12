"use client";

import AccountInfo from "@/src/components/schedule/components/profile/AccountInfo";
import ProfileActions from "@/src/components/schedule/components/profile/ProfileActions";
import ProfileCard from "@/src/components/schedule/components/profile/ProfileCard";
import BaseCard from "@/src/components/ui/card/BaseCard";
import Skeleton from "@/src/components/ui/Skeleton";
import { Column } from "@/src/components/ui/layout/flex";

import { useMyInfo } from "@/src/hooks/querys/useMembers";

export default function ProfilePage() {
  const { data: user, isPending, isError } = useMyInfo();

  if (isPending) {
    return (
      <main className="mx-auto grid w-full max-w-[1100px] gap-8 px-1 py-2 lg:grid-cols-[auto_1fr] lg:items-center lg:justify-center">
        <div className="mx-auto flex w-full flex-col items-center gap-3 py-2 lg:h-[min(560px,100dvh-11rem)] lg:w-[min(560px,100dvh-11rem)] lg:justify-center">
          <Skeleton className="h-60 w-60 rounded-full" />
          <Skeleton className="h-7 w-32" />
          <Skeleton className="h-3.5 w-48" />
          <Skeleton className="h-3 w-40" />
        </div>

        <Column className="w-full max-w-[440px] gap-4 lg:ml-4">
          <Skeleton className="h-2.5 w-16" />
          <Skeleton className="h-5 w-20" />
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="flex w-full items-center gap-3 border-b border-divider py-4 last:border-none"
            >
              <Skeleton className="h-9 w-9 rounded-xl" />
              <Column className="flex-1 gap-1.5">
                <Skeleton className="h-2.5 w-12" />
                <Skeleton className="h-4 w-36" />
              </Column>
            </div>
          ))}
        </Column>
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
    <main className="mx-auto grid w-full max-w-[1100px] gap-8 px-1 py-2 lg:grid-cols-[auto_1fr] lg:items-center lg:justify-center">
      <ProfileCard user={user} />

      <Column className="w-full max-w-[460px] gap-5 lg:ml-4">
        <AccountInfo user={user} />
        <ProfileActions auth={user.provider} />
      </Column>
    </main>
  );
}
