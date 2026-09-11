"use client";

import { usePathname } from "next/navigation";

import GroupSwitcher from "../../group/GroupSwitcher";

export default function MobileGroupSwitcher() {
  const pathname = usePathname();

  if (pathname !== "/schedule") return null;

  return (
    <div className="absolute right-0 top-1/2 -translate-y-1/2 lg:hidden">
      <GroupSwitcher />
    </div>
  );
}
