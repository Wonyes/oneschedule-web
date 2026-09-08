"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

import GroupDashboard from "@/src/components/group/GroupDashboard";
import GroupDashboardSkeleton from "@/src/components/group/GroupDashboardSkeleton";
import GroupLanding from "@/src/components/group/GroupLanding";
import GroupPicker from "@/src/components/group/GroupPicker";
import { useActiveGroup } from "@/src/hooks/querys/useGroup";
import { useMounted } from "@/src/hooks/useMounted";

function GroupPageContent() {
  const router = useRouter();
  const mounted = useMounted();
  const { groups, group, isPending, needsSelection } = useActiveGroup();

  const wantsAdd = useSearchParams().get("add") === "1";

  /*
    ?add=1은 대시보드가 아니라 탐색 화면으로 간다. 그룹을 기다리는 동안
    대시보드 스켈레톤을 깔면 전혀 다른 모양이 떴다가 바뀐다.

    안쪽 목록은 각자 로딩을 처리하므로 바로 그려도 된다. 취소 버튼만
    "돌아갈 그룹이 있는지"를 알아야 해서 데이터가 온 뒤에 붙인다.
  */
  if (wantsAdd) {
    return (
      <GroupLanding
        onCancel={
          !isPending && groups.length > 0
            ? () => router.replace("/group")
            : undefined
        }
      />
    );
  }

  if (!mounted || isPending) {
    return <GroupDashboardSkeleton />;
  }

  if (groups.length === 0) {
    return <GroupLanding />;
  }

  if (needsSelection) {
    return (
      <div className="flex h-full w-full items-start justify-center py-6">
        <GroupPicker
          groups={groups}
          description="어떤 그룹을 관리할지 골라주세요."
        />
      </div>
    );
  }

  if (!group) {
    return <GroupLanding />;
  }

  return <GroupDashboard group={group} />;
}

export default function GroupPage() {
  return (
    <Suspense fallback={<GroupDashboardSkeleton />}>
      <GroupPageContent />
    </Suspense>
  );
}
