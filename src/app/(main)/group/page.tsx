"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";

import GroupDashboard from "@/src/components/group/GroupDashboard";
import GroupDashboardSkeleton from "@/src/components/group/GroupDashboardSkeleton";
import GroupLanding from "@/src/components/group/GroupLanding";
import GroupPicker from "@/src/components/group/GroupPicker";
import { useActiveGroup } from "@/src/hooks/querys/useGroup";

function GroupPageContent() {
  const { groups, group, isPending, needsSelection } = useActiveGroup();

  const wantsAdd = useSearchParams().get("add") === "1";
  const [isAdding, setIsAdding] = useState(wantsAdd);

  if (isPending) {
    return <GroupDashboardSkeleton />;
  }

  if (groups.length === 0 || isAdding) {
    return (
      <GroupLanding
        onCancel={groups.length > 0 ? () => setIsAdding(false) : undefined}
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

  return (
    <GroupDashboard
      group={group}
      groups={groups}
      onAddGroup={() => setIsAdding(true)}
    />
  );
}

export default function GroupPage() {
  return (
    <Suspense fallback={<GroupDashboardSkeleton />}>
      <GroupPageContent />
    </Suspense>
  );
}
