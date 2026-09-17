import { useMemo } from "react";
import { endOfWeek, startOfWeek } from "date-fns";
import { Mail } from "lucide-react";
import { motion } from "motion/react";

import Plate from "@/src/components/common/Plate";

import GoogleMark from "@/src/components/common/GoogleMark";
import { Row } from "@/src/components/ui/layout/flex";
import { useActiveGroup } from "@/src/hooks/querys/useGroup";
import { MyInfoResponse } from "@/src/hooks/querys/useMembers";
import { useSchedules } from "@/src/hooks/querys/useSchedule";
import { useMemberImagePicker } from "@/src/hooks/useProfileImagePicker";
import { rise, stagger } from "@/src/lib/motion";
import { roleOf } from "@/src/types/group";
import ProfileOrbit from "./ProfileOrbit";
import Stat from "../ui/Stat";

export default function ProfileCard({ user }: { user: MyInfoResponse }) {
  const picker = useMemberImagePicker();
  const { groups } = useActiveGroup();
  const { data: schedules } = useSchedules("PERSONAL");

  const ownerCount = groups.filter((g) => roleOf(g.groupRole).owner).length;

  const weekCount = useMemo(() => {
    const now = new Date();
    const from = startOfWeek(now, { weekStartsOn: 0 }).getTime();
    const to = endOfWeek(now, { weekStartsOn: 0 }).getTime();

    return (schedules ?? []).filter((s) => {
      const t = new Date(s.startDate).getTime();
      return t >= from && t <= to;
    }).length;
  }, [schedules]);

  return (
    <Plate
      size="compact"
      className="flex w-full items-center justify-center py-2 lg:py-0"
    >
      <motion.div
        variants={stagger}
        initial="hidden"
        animate="show"
        className="flex flex-col items-center gap-2 text-center"
      >
        <motion.div variants={rise}>
          <ProfileOrbit
            nickname={user.nickname}
            imageUrl={user.profileImageUrl}
            groups={groups}
            picker={picker}
          />
        </motion.div>

        <motion.div variants={rise} className="flex flex-col items-center">
          <span className="eyebrow">PROFILE</span>
          <h1 className="mt-1 typo-h2 tracking-tight text-foreground">
            {user.nickname}
          </h1>
          <Row className="mt-1 gap-1.5 typo-caption-1 text-muted">
            <span>{user.name}</span>
            <span className="text-place-h">·</span>
            <span>{user.email}</span>
          </Row>
        </motion.div>

        <motion.div variants={rise}>
          <Row className="mt-1 flex-wrap justify-center gap-x-4 gap-y-1">
            <Stat label="그룹" value={groups.length} countUp />
            <Stat label="관리자" value={ownerCount} tone="pending" countUp />
            <Stat label="이번 주 일정" value={weekCount} countUp />
          </Row>
        </motion.div>

        <motion.div variants={rise}>
          <Row className="neu-flat mt-2 gap-1.5 rounded-full px-3 py-1.5">
            {user.provider === "GOOGLE" ? (
              <GoogleMark size={12} />
            ) : (
              <Mail size={12} strokeWidth={1.75} className="text-accent" />
            )}
            <span className="typo-caption-3 text-secondary">
              {user.provider === "GOOGLE" ? "Google 로그인" : "이메일 로그인"}
            </span>
          </Row>
        </motion.div>
      </motion.div>
    </Plate>
  );
}
