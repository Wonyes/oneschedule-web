"use client";

import { usePathname } from "next/navigation";

import GroupSwitcher from "../../group/GroupSwitcher";

export default function GroupHeaderControls() {
  const pathname = usePathname();
  const isGroupPage = pathname === "/group" || pathname.startsWith("/group/");

  if (!isGroupPage) return null;

  return <GroupSwitcher align="left" />;
}
