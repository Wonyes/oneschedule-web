"use client";

import GroupLanding from "@/src/components/group/GroupLanding";
import GroupDashboard from "@/src/components/group/GroupDashboard";
import { useMyGroup } from "@/src/hooks/querys/useGroup";
import { useMyInfo } from "@/src/hooks/querys/useMembers";
import GroupDashboardSkeleton from "@/src/components/group/GroupDashboardSkeleton";

export default function GroupPage() {
  const { data: user, isLoading: userLoading } = useMyInfo();
  const { data: group, isLoading: groupLoading } = useMyGroup(
    !!user?.groupCode,
  );

  if (userLoading || groupLoading) {
    return <GroupDashboardSkeleton />;
  }

  if (!user?.groupCode) {
    return <GroupLanding />;
  }

  return <GroupDashboard group={group} />;
}
