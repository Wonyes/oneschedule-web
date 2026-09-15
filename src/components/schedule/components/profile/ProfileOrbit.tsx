"use client";

import { Camera, Crown, Loader2 } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";

import AvatarImage from "@/src/components/common/AvatarImage";
import OrbitRing, { OrbitItem } from "@/src/components/common/OrbitRing";
import GroupAvatar from "@/src/components/group/GroupAvatar";
import { groupPath } from "@/src/lib/activeGroup";
import { useMediaQuery } from "@/src/hooks/useMediaQuery";
import { springSoft } from "@/src/lib/motion";
import { MyGroupResponse } from "@/src/types/group";

const MAX_SATELLITES = 6;

export default function ProfileOrbit({
  nickname,
  imageUrl,
  groups,
  uploading,
  onPickImage,
}: {
  nickname: string;
  imageUrl?: string | null;
  groups: MyGroupResponse[];
  uploading: boolean;
  onPickImage: () => void;
}) {
  const wide = useMediaQuery("(min-width: 640px)");
  const shown = groups.slice(0, MAX_SATELLITES);
  const hidden = groups.length - shown.length;

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
        {group.groupRole === "SUPER" && (
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
        <Link
          href="/group"
          prefetch
          aria-label={`그룹 ${hidden}개 더 보기`}
          className="neu-flat flex h-9 w-9 items-center justify-center rounded-full typo-caption-3 font-semibold text-muted btn-spring hover:scale-110"
        >
          +{hidden}
        </Link>
      ),
    });
  }

  return (
    <OrbitRing
      radius={wide ? 96 : 80}
      className={wide ? "h-60 w-60" : "h-52 w-52"}
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

          <button
            type="button"
            onClick={onPickImage}
            disabled={uploading}
            aria-label="프로필 사진 변경"
            className="neu-btn btn-spring absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full text-secondary hover:text-foreground"
          >
            {uploading ? (
              <Loader2 size={13} className="animate-spin text-accent" />
            ) : (
              <Camera size={13} strokeWidth={1.75} />
            )}
          </button>
        </>
      }
    />
  );
}
