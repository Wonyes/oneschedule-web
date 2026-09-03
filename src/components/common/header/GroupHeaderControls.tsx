"use client";

import { Plus } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

import { useActiveGroup } from "@/src/hooks/querys/useGroup";
import GroupSwitcher from "../../group/GroupSwitcher";

export default function GroupHeaderControls() {
  const pathname = usePathname();
  const router = useRouter();
  const isGroupPage = pathname === "/group";

  const { groups } = useActiveGroup(isGroupPage);

  if (!isGroupPage || groups.length === 0) return null;

  return (
    <div className="flex items-center gap-1.5">
      {groups.length > 1 && <GroupSwitcher />}

      <button
        type="button"
        onClick={() => router.push("/group?add=1")}
        className="btn-spring neu-btn text-secondary hover:text-foreground flex h-8 items-center gap-1.5 rounded-lg px-3 typo-caption-2 font-medium"
      >
        <Plus size={14} strokeWidth={2} />
        그룹 추가
      </button>
    </div>
  );
}
