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

  // add=1 여부를 그대로 화면 상태로 쓴다(로컬 state로 따로 안 들고 있음).
  // 헤더의 "그룹 추가"는 이 쿼리로 이동만 시키고, "돌아가기"도 이 쿼리를
  // 지우는 방식으로 맞춰야 URL과 화면이 안 어긋난다.
  const wantsAdd = useSearchParams().get("add") === "1";

  // 마운트 전에는 서버와 같은 화면을 그려야 하이드레이션이 어긋나지 않는다
  if (!mounted || isPending) {
    return <GroupDashboardSkeleton />;
  }

  if (groups.length === 0 || wantsAdd) {
    return (
      <GroupLanding
        onCancel={
          groups.length > 0 ? () => router.replace("/group") : undefined
        }
      />
    );
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
