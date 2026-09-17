import { Crown, Shield } from "lucide-react";

import { GroupRole } from "@/src/types/group";

const BADGE: Partial<Record<GroupRole, { icon: typeof Crown; label: string; className: string }>> = {
  SUPER: { icon: Crown, label: "관리자", className: "text-pending-500" },
  SUB: { icon: Shield, label: "부관리자", className: "text-accent" },
};

export default function RoleBadge({ role }: { role: GroupRole }) {
  const badge = BADGE[role];
  if (!badge) return null;

  return (
    <badge.icon
      size={12}
      strokeWidth={2}
      className={`shrink-0 ${badge.className}`}
      aria-label={badge.label}
    />
  );
}
