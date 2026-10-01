"use client";

import { usePathname } from "next/navigation";

import GroupSwitcher from "../../group/GroupSwitcher";

export default function GroupHeaderControls() {
  const pathname = usePathname();
  const isGroupPage = pathname === "/group" || pathname.startsWith("/group/");

  if (!isGroupPage) return null;

  return (
    <>
      <div className="lg:hidden">
        <GroupSwitcher compact />
      </div>
      <div className="hidden lg:block">
        <GroupSwitcher align="left" />
      </div>
    </>
  );
}
