"use client";

import { usePathname } from "next/navigation";

import GroupSwitcher from "../../group/GroupSwitcher";

export default function ScheduleGroupSwitcher({
  className,
  compact = false,
}: {
  className?: string;
  compact?: boolean;
}) {
  const pathname = usePathname();

  if (pathname !== "/schedule") return null;

  return (
    <div className={className}>
      <GroupSwitcher compact={compact} />
    </div>
  );
}
