"use client";

import { usePathname } from "next/navigation";

import GroupSwitcher from "../../group/GroupSwitcher";

export default function MobileGroupSwitcher() {
  const pathname = usePathname();

  if (pathname !== "/schedule") return null;

  return (
    <div className="lg:hidden">
      <GroupSwitcher />
    </div>
  );
}
