"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";

import GroupDashboard from "@/src/components/group/GroupDashboard";
import GroupDashboardSkeleton from "@/src/components/group/GroupDashboardSkeleton";
import { useActiveGroup } from "@/src/hooks/querys/useGroup";
import { useActiveGroupStore } from "@/src/hooks/stores/useActiveGroupStore";
import { useMounted } from "@/src/hooks/useMounted";
import { groupPath, parseGroupNo } from "@/src/lib/activeGroup";

export default function GroupDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const router = useRouter();
  const mounted = useMounted();

  const { groups, isPending } = useActiveGroup();
  const activeGroupNo = useActiveGroupStore((s) => s.activeGroupNo);
  const setActiveGroup = useActiveGroupStore((s) => s.setActiveGroup);

  const groupNo = parseGroupNo(slug);
  const group = groups.find((item) => item.groupNo === groupNo);
  const ready = mounted && !isPending;

  useEffect(() => {
    if (!ready) return;

    if (!group) {
      router.replace("/group");
      return;
    }

    if (activeGroupNo !== group.groupNo) setActiveGroup(group.groupNo);

    const canonical = groupPath(group);
    if (`/group/${decodeURIComponent(slug)}` !== canonical) {
      router.replace(canonical);
    }
  }, [ready, group, slug, activeGroupNo, setActiveGroup, router]);

  if (!ready || !group) {
    return <GroupDashboardSkeleton />;
  }

  return <GroupDashboard group={group} />;
}
