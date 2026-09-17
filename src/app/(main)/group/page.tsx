"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";

import GroupDashboardSkeleton from "@/src/components/group/dashboard/GroupDashboardSkeleton";
import GroupLanding from "@/src/components/group/landing/GroupLanding";
import GroupPicker from "@/src/components/group/landing/GroupPicker";
import { useActiveGroup } from "@/src/hooks/querys/useGroup";
import { useMounted } from "@/src/hooks/useMounted";
import { groupPath } from "@/src/lib/activeGroup";

function GroupPageContent() {
  const router = useRouter();
  const mounted = useMounted();
  const { groups, group, isPending, needsSelection } = useActiveGroup();

  const wantsAdd = useSearchParams().get("add") === "1";

  const target = !wantsAdd && mounted && !isPending && group ? group : null;

  useEffect(() => {
    if (target) router.replace(groupPath(target));
  }, [target, router]);

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

  return <GroupDashboardSkeleton />;
}

export default function GroupPage() {
  return (
    <Suspense fallback={<GroupDashboardSkeleton />}>
      <GroupPageContent />
    </Suspense>
  );
}
