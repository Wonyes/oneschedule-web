"use client";

import { Crown } from "lucide-react";
import { motion } from "motion/react";
import { usePathname, useRouter } from "next/navigation";

import BaseCard from "@/src/components/ui/card/BaseCard";
import { Column, Row } from "@/src/components/ui/layout/flex";
import Stat from "@/src/components/ui/Stat";
import {
  useJoinRequests,
  useMemberPresence,
} from "@/src/hooks/querys/useGroup";
import { useGroupImagePicker } from "@/src/hooks/useProfileImagePicker";
import { rise, stagger } from "@/src/lib/motion";
import { MyGroupResponse, roleOf } from "@/src/types/group";
import { cn } from "@/src/utils/cn";
import { countOnline } from "@/src/utils/presence";
import {
  UPCOMING_RANGE_DAYS,
  useGroupSchedules,
} from "../schedule/useGroupSchedules";
import VisibilityBadge from "../VisibilityBadge";
import GroupHeroActions from "./GroupHeroActions";
import { GroupEditPanel } from "./GroupHeroEditors";
import GroupOrbit from "./GroupOrbit";
import { useGroupHeroEdit } from "./useGroupHeroEdit";
import { useLeaveGroup } from "./useLeaveGroup";

/** 보이는 섹션 중 첫 번째로 스크롤 (데스크톱·모바일이 다른 id를 씀) */
const scrollTo = (ids: string[]) => {
  const target = ids
    .map((id) => document.getElementById(id))
    .find((el) => el && el.offsetParent !== null);
  target?.scrollIntoView({ behavior: "smooth", block: "start" });
};

export const GroupHero = ({ group }: { group: MyGroupResponse }) => {
  const router = useRouter();
  const pathname = usePathname();
  const { owner } = roleOf(group.groupRole);
  const canReview = owner && group.visibility === "PUBLIC_APPROVAL";

  const picker = useGroupImagePicker(group.groupNo);
  const edit = useGroupHeroEdit(group);
  const leave = useLeaveGroup(group);

  const { today, upcoming } = useGroupSchedules(group.groupNo);
  const { data: presence } = useMemberPresence(group.groupNo);
  const { data: requestPages } = useJoinRequests(group.groupNo, canReview);
  const pendingCount = requestPages?.pages[0]?.totalElements ?? 0;

  const goToRequests = () => {
    router.replace(`${pathname}?tab=requests`, { scroll: false });
    scrollTo(["group-manage", "group-team"]);
  };

  return (
    <BaseCard glow className="relative overflow-hidden p-4 sm:p-6">
      <div
        aria-hidden
        className="glow-blob pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full"
      />

      <motion.div
        variants={stagger}
        initial="hidden"
        animate="show"
        className="relative flex flex-col items-center gap-5 lg:flex-row lg:items-center lg:gap-10"
      >
        <motion.div variants={rise}>
          <GroupOrbit
            name={group.groupName}
            imageUrl={group.profileImageUrl}
            members={group.members}
            presence={presence}
            picker={owner ? picker : undefined}
            onMemberClick={() => scrollTo(["group-team"])}
          />
        </motion.div>

        <Column className="w-full min-w-0 flex-1 items-center gap-2 text-center lg:items-start lg:text-left">
          <motion.div variants={rise}>
            <Row className="flex-wrap justify-center gap-1.5 lg:justify-start">
              <span className="eyebrow">GROUP</span>
              <VisibilityBadge visibility={group.visibility} />
              {owner && (
                <Row className="neu-flat h-6 gap-1 rounded-full px-2.5">
                  <Crown
                    size={12}
                    strokeWidth={2}
                    className="text-pending-500"
                  />
                  <span className="typo-caption-3 font-semibold text-pending-500">
                    그룹장
                  </span>
                </Row>
              )}
            </Row>
          </motion.div>

          {edit.editing ? (
            <motion.div variants={rise} className="w-full">
              <GroupEditPanel
                name={edit.name}
                onNameChange={edit.onNameChange}
                description={edit.description}
                onDescriptionChange={edit.onDescriptionChange}
                onSave={edit.save}
                onCancel={edit.cancel}
                saving={edit.saving}
              />
            </motion.div>
          ) : (
            <motion.div variants={rise} className="w-full min-w-0">
              <h1 className="truncate typo-h2 text-foreground">
                {group.groupName}
              </h1>
              <p
                className={cn(
                  "mx-auto mt-1.5 max-w-[520px] typo-caption-1 leading-relaxed lg:mx-0",
                  group.description ? "text-secondary" : "text-place-h",
                )}
              >
                {group.description || "아직 그룹 소개가 없어요."}
              </p>
            </motion.div>
          )}

          <motion.div variants={rise}>
            <Row className="mt-1 flex-wrap justify-center gap-x-4 gap-y-1.5 lg:justify-start">
              <Stat label="멤버" value={group.members.length} />
              <Stat
                label="온라인"
                value={countOnline(presence)}
                tone="success"
              />
              <Stat label="오늘" value={today.length} />
              <Stat
                label={`${UPCOMING_RANGE_DAYS}일 내`}
                value={upcoming.length}
              />
            </Row>
          </motion.div>

          <motion.div variants={rise} className="w-full">
            <GroupHeroActions
              groupCode={group.groupCode}
              owner={owner}
              editing={edit.editing}
              pendingCount={pendingCount}
              onEdit={edit.start}
              onRequests={goToRequests}
              leaveLabel={leave.label}
              onLeave={leave.confirmLeave}
            />
          </motion.div>
        </Column>
      </motion.div>
    </BaseCard>
  );
};
