"use client";

import { Check, ChevronDown, Plus, Users } from "lucide-react";
import { useRouter } from "next/navigation";

import DropdownMenu from "../ui/DropdownMenu";
import { Column } from "../ui/layout/flex";
import { useActiveGroup } from "@/src/hooks/querys/useGroup";
import { useActiveGroupStore } from "@/src/hooks/stores/useActiveGroupStore";

export default function GroupSwitcher({
  enabled = true,
}: {
  enabled?: boolean;
}) {
  const router = useRouter();

  const { groups, group } = useActiveGroup(enabled);
  const setActiveGroup = useActiveGroupStore((s) => s.setActiveGroup);

  if (groups.length === 0) return null;

  const isSingle = groups.length === 1;

  return (
    <DropdownMenu
      label="그룹 전환"
      disabled={isSingle}
      panelClassName="w-56"
      triggerClassName={`text-secondary px-2 py-1.5 typo-caption-2 lg:px-2.5 ${
        isSingle ? "" : "hover:text-foreground"
      }`}
      trigger={(isOpen) => (
        <>
          <Users
            size={13}
            strokeWidth={1.75}
            className="text-accent shrink-0"
          />

          <span className="max-w-[72px] truncate sm:max-w-[120px] hidden lg:inline">
            {group?.groupName}
          </span>

          {!isSingle && (
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
                    close();
                  }}
                  className="hover:bg-surface-hover flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left transition-colors"
                >
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

          <button
            type="button"
            role="menuitem"
            onClick={() => {
              close();
              router.push("/group?add=1");
            }}
            className="text-accent hover:bg-accent/10 flex w-full items-center gap-2 rounded-xl px-3 py-2 typo-caption-2 transition-colors"
          >
            <Plus size={14} strokeWidth={2} />
            그룹 만들기 · 참여하기
          </button>
        </>
      )}
    </DropdownMenu>
  );
}
