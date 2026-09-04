"use client";

import { Plus } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { useActiveGroup } from "@/src/hooks/querys/useGroup";
import GroupSwitcher from "../../group/GroupSwitcher";

export default function GroupHeaderControls() {
  const pathname = usePathname();
  const isGroupPage = pathname === "/group";

  const { groups } = useActiveGroup(isGroupPage);

  if (!isGroupPage || groups.length === 0) return null;

  return (
    <div className="flex items-center gap-1.5">
      {groups.length > 1 && <GroupSwitcher />}

      <Link
        href="/group?add=1"
        prefetch
        aria-label="그룹 추가"
        className="btn-spring neu-btn text-secondary hover:text-foreground flex h-8 items-center gap-1.5 rounded-lg px-2.5 typo-caption-2 font-medium sm:px-3"
      >
        <Plus size={14} strokeWidth={2} />
        <span className="hidden sm:inline">그룹 추가</span>
      </Link>
    </div>
  );
}
