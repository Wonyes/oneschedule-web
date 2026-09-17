"use client";

import { Crown } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";

import AvatarImage from "@/src/components/common/AvatarImage";
import OrbitRing, {
  OrbitItem,
  splitSatellites,
} from "@/src/components/common/orbit/OrbitRing";
import OrbitMore from "@/src/components/common/orbit/OrbitMore";
import OrbitEditButton from "@/src/components/common/orbit/OrbitEditButton";
import GroupAvatar from "@/src/components/common/GroupAvatar";
import { ProfileImagePicker } from "@/src/hooks/useProfileImagePicker";
import { groupPath } from "@/src/lib/activeGroup";
import { springSoft } from "@/src/lib/motion";
import { MyGroupResponse, roleOf } from "@/src/types/group";

const MAX_SATELLITES = 6;

export default function ProfileOrbit({
  nickname,
  imageUrl,
  groups,
  picker,
}: {
  nickname: string;
  imageUrl?: string | null;
  groups: MyGroupResponse[];
  picker: ProfileImagePicker;
}) {
  const { shown, hidden } = splitSatellites(groups, MAX_SATELLITES);

  const items: OrbitItem[] = shown.map((group) => ({
    key: group.groupNo,
    node: (
      <Link
        href={groupPath(group)}
        prefetch
        title={group.groupName}
        className="relative block btn-spring hover:scale-110"
      >
        <GroupAvatar
          name={group.groupName}
          imageUrl={group.profileImageUrl}
          className="h-9 w-9 rounded-full"
        />
        {roleOf(group.groupRole).owner && (
          <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-pending-500 text-on-primary ring-2 ring-[var(--surface)]">
            <Crown size={9} strokeWidth={2.5} />
          </span>
        )}
      </Link>
    ),
  }));

  if (hidden > 0) {
    items.push({
      key: "more",
      node: (
        <OrbitMore
          count={hidden}
          label={`그룹 ${hidden}개 더 보기`}
          href="/group"
        />
      ),
    });
  }

  return (
    <OrbitRing
      size="md"
      wideSize="xl"
      items={items}
      center={
        <>
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={springSoft}
            className="neu-float flex h-[88px] w-[88px] items-center justify-center overflow-hidden rounded-full typo-h4 font-bold text-accent ring-4 ring-[var(--surface)]"
          >
            <AvatarImage
              src={imageUrl}
              nickname={nickname}
              fallback={nickname[0]}
            />
          </motion.div>

          <OrbitEditButton label="프로필 사진 변경" picker={picker} />
        </>
      }
    />
  );
}
