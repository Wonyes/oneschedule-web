"use client";

import AccountInfo from "@/src/components/profile/AccountInfo";
import ProfileActions from "@/src/components/profile/ProfileActions";
import ProfileCard from "@/src/components/profile/ProfileCard";
import BaseCard from "@/src/components/ui/card/BaseCard";
import Skeleton from "@/src/components/ui/Skeleton";
import { Column } from "@/src/components/ui/layout/flex";

import { useMyInfo } from "@/src/hooks/querys/useMembers";

export default function ProfilePage() {
  const { data: user, isPending, isError } = useMyInfo();

  if (isPending) {
    return (
      <main className="mx-auto grid w-full max-w-[1100px] gap-8 px-1 py-2 lg:grid-cols-[auto_1fr] lg:items-center lg:justify-center">
        {/* ProfileCard: 오빗 · 이름 · 이메일 · 통계 3개 · 로그인 방식 칩 */}
        <div className="mx-auto flex w-full flex-col items-center gap-2 py-2 lg:h-[min(560px,100dvh-11rem)] lg:w-[min(560px,100dvh-11rem)] lg:justify-center">
          <Skeleton className="h-52 w-52 rounded-full sm:h-60 sm:w-60" />
          <Skeleton className="mt-1 h-2.5 w-14" />
          <Skeleton className="h-7 w-32" />
          <Skeleton className="h-3.5 w-48" />
          <div className="mt-1 flex gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-3.5 w-14" />
            ))}
          </div>
          <Skeleton className="mt-2 h-7 w-24 rounded-full" />
        </div>

        <Column className="w-full max-w-[460px] gap-5 lg:ml-4">
          {/* AccountInfo: 헤딩 + InfoRow 4개 */}
          <Column className="w-full gap-2">
            <Column className="gap-1">
              <Skeleton className="h-2.5 w-16" />
              <Skeleton className="h-5 w-20" />
            </Column>
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="flex w-full items-center gap-3 border-b border-divider py-4 last:border-none"
              >
                <Skeleton className="h-9 w-9 shrink-0 rounded-xl" />
                <Column className="flex-1 gap-1.5">
                  <Skeleton className="h-2.5 w-12" />
                  <Skeleton className="h-4 w-36" />
                </Column>
              </div>
            ))}
          </Column>

          {/* ProfileActions: 버튼 2개 나란히 */}
          <div className="flex w-full gap-2">
            <Skeleton className="h-10 flex-1 rounded-xl" />
            <Skeleton className="h-10 flex-1 rounded-xl" />
          </div>
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
