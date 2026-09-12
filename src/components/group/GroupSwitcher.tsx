"use client";

import { Check, ChevronDown, Plus, Users } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import DropdownMenu from "../ui/DropdownMenu";
import GroupAvatar from "./GroupAvatar";
import { Column } from "../ui/layout/flex";
import { useActiveGroup } from "@/src/hooks/querys/useGroup";
import { useActiveGroupStore } from "@/src/hooks/stores/useActiveGroupStore";
import { groupPath } from "@/src/lib/activeGroup";

export default function GroupSwitcher({
  enabled = true,
  align = "right",
  compact = false,
}: {
  enabled?: boolean;
  align?: "left" | "right";
  /** 아바타만 보여주고 그룹 이름은 툴팁으로 넘긴다. */
  compact?: boolean;
}) {
  const { groups, group } = useActiveGroup(enabled);
  const setActiveGroup = useActiveGroupStore((s) => s.setActiveGroup);
  const router = useRouter();
  const pathname = usePathname();

  if (groups.length === 0) return null;

  return (
    <DropdownMenu
      label={group && compact ? `그룹 전환 · ${group.groupName}` : "그룹 전환"}
      align={align}
      panelClassName="w-56"
      triggerClassName={
        compact
          ? "relative h-10 w-10 justify-center rounded-xl p-0 text-secondary"
          : "text-secondary px-2 py-1.5 typo-caption-2 hover:text-foreground lg:px-2.5"
      }
      trigger={(isOpen) => (
        <>
          {group ? (
            <GroupAvatar
              name={group.groupName}
              imageUrl={group.profileImageUrl}
              size={compact ? "sm" : "xs"}
            />
          ) : (
            <Users
              size={13}
              strokeWidth={1.75}
              className="text-accent shrink-0"
            />
          )}

          {!compact && (
            <span className="hidden max-w-[72px] truncate sm:max-w-[120px] lg:inline">
              {group?.groupName}
            </span>
          )}

          {compact ? (
            <span
              className={`absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-on-primary ring-2 ring-[var(--surface)] transition-transform ${isOpen ? "rotate-180" : ""}`}
            >
              <ChevronDown size={10} strokeWidth={2.5} />
            </span>
          ) : (
            <ChevronDown
              size={12}
              strokeWidth={1.75}
              className={`shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`}
            />
          )}
        </>
      )}
    >
      {(close) => (
        <>
          <Column className="w-full gap-0.5">
            {groups.map((item) => {
              const isActive = item.groupNo === group?.groupNo;

              return (
                <button
                  key={item.groupNo}
                  type="button"
                  role="menuitemradio"
                  aria-checked={isActive}
                  onClick={() => {
                    setActiveGroup(item.groupNo);
                    if (pathname.startsWith("/group")) {
                      router.push(groupPath(item));
                    }
                    close();
                  }}
                  className="hover:bg-surface-hover flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left transition-colors"
                >
                  <GroupAvatar
                    name={item.groupName}
                    imageUrl={item.profileImageUrl}
                    size="sm"
                  />
                  <Column className="min-w-0 flex-1 gap-0.5">
                    <span className="typo-caption-2 text-foreground truncate">
                      {item.groupName}
                    </span>
                    <span className="typo-caption-3 text-muted">
                      멤버 {item.members?.length ?? 0}명
                    </span>
                  </Column>

                  {isActive && (
                    <Check
                      size={14}
                      strokeWidth={2.5}
                      className="text-accent shrink-0"
                    />
                  )}
                </button>
              );
            })}
          </Column>

          <div className="border-divider my-1.5 border-t" />

          <Link
            href="/group?add=1"
            prefetch
            role="menuitem"
            onClick={close}
            className="text-accent hover:bg-accent/10 flex w-full items-center gap-2 rounded-xl px-3 py-2 typo-caption-2 transition-colors"
          >
            <Plus size={14} strokeWidth={2} />
            그룹 만들기 · 참여하기
          </Link>
        </>
      )}
    </DropdownMenu>
  );
}
