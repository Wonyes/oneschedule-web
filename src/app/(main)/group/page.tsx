"use client";

import GroupLanding from "@/src/components/group/GroupLanding";
import GroupDashboard from "@/src/components/group/GroupDashboard";
import { useMyGroup } from "@/src/hooks/querys/useGroup";

export default function GroupPage() {
  const { data: group, isLoading } = useMyGroup();

  console.log(group);

  if (isLoading) {
    return <div>loading...</div>;
  }

  if (!group) {
    return <GroupLanding />;
  }

  return <GroupDashboard group={group} />;
}
