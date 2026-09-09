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
