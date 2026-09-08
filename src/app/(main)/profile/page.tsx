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
      <main className="mx-auto w-full max-w-[860px] px-1 py-1">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-start">
          <div className="flex w-full flex-col gap-3 lg:w-[320px] lg:shrink-0">
            <div className="rounded-[var(--radius-outer)] neu-flat p-8">
              <Column className="items-center gap-3">
                <Skeleton className="h-20 w-20 rounded-full" />
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-3.5 w-16" />
                <Skeleton className="h-3 w-32" />
                <Skeleton className="mt-2 h-6 w-24 rounded-full" />
              </Column>
            </div>

            <Skeleton className="h-[60px] w-full rounded-[var(--radius-outer)]" />
            <Skeleton className="h-[60px] w-full rounded-[var(--radius-outer)]" />
          </div>

          <div className="min-w-0 flex-1 rounded-[var(--radius-outer)] neu-flat p-6">
            <Column className="mb-3 gap-1">
              <Skeleton className="h-2.5 w-16" />
              <Skeleton className="h-5 w-20" />
            </Column>

            <Column className="w-full gap-0">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="w-full border-b border-divider py-4 last:border-none"
                >
                  <Skeleton className="h-3 w-14" />
                  <Skeleton className="mt-2 h-4 w-32" />
                </div>
              ))}
            </Column>
          </div>
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
          {/* 모바일에서는 비밀번호 변경/로그아웃이 계정 정보보다 아래로 가야 해서
              lg 이상에서만 여기(왼쪽 컬럼)에 렌더링한다 */}
          <div className="hidden lg:block">
            <ProfileActions auth={user.provider} />
          </div>
        </div>

        <div className="min-w-0 flex-1">
          <AccountInfo user={user} />
        </div>

        <div className="lg:hidden">
          <ProfileActions auth={user.provider} />
        </div>
      </div>
    </main>
  );
}
