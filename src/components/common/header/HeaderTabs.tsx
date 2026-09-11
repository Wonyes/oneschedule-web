"use client";

import { usePathname } from "next/navigation";

import SegmentedTabs from "@/src/components/ui/layout/SegmentedTabs";
import { useScheduleView } from "@/src/hooks/useScheduleView";
import { useActiveGroup } from "@/src/hooks/querys/useGroup";
import GroupSwitcher from "../../group/GroupSwitcher";

export default function HeaderTabs() {
  const { viewType, setViewType } = useScheduleView();
  const pathname = usePathname();

  const isSchedulePage = pathname === "/schedule";
  const { groups } = useActiveGroup(isSchedulePage);
  const hasGroup = groups.length > 0;

  if (!isSchedulePage) return null;

  return (
    <div className="relative flex items-center">
      <SegmentedTabs
        fit
        label="일정 보기"
        value={viewType}
        onChange={setViewType}
        tabs={[
          { key: "PERSONAL", label: "MY Schedule", shortLabel: "MY" },
          {
            key: "GROUP",
            label: "GROUP Schedule",
            shortLabel: "GROUP",
            disabled: !hasGroup,
            title: hasGroup ? undefined : "소속된 그룹이 없어요",
          },
        ]}
      />

      <div className="absolute left-full top-1/2 ml-1 hidden -translate-y-1/2 lg:block">
        <GroupSwitcher />
      </div>
    </div>
  );
}
