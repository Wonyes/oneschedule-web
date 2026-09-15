"use client";

import { Camera } from "lucide-react";

import AvatarImage from "@/src/components/common/AvatarImage";
import OrbitRing, { OrbitItem } from "@/src/components/common/OrbitRing";
import { GroupMember, MemberPresence } from "@/src/types/group";
import { useMediaQuery } from "@/src/hooks/useMediaQuery";
import { cn } from "@/src/utils/cn";

const MAX_SATELLITES = 6;

export default function GroupOrbit({
  name,
  imageUrl,
  members,
  presence,
  canEditImage = false,
  onPickImage,
  onMemberClick,
}: {
  name: string;
  imageUrl?: string | null;
  members: GroupMember[];
  presence?: Map<number, MemberPresence>;
  canEditImage?: boolean;
  onPickImage?: () => void;
  onMemberClick?: () => void;
}) {
  const wide = useMediaQuery("(min-width: 640px)");
  const shown = members.slice(0, MAX_SATELLITES);
  const hidden = members.length - shown.length;

  const items: OrbitItem[] = shown.map((member) => {
    const online = presence?.get(member.memberNo)?.online ?? false;

    return {
      key: member.memberNo,
      node: (
        <button
          type="button"
          onClick={onMemberClick}
          title={`${member.nickname}${online ? " · 온라인" : ""}`}
          className="relative block btn-spring hover:scale-110"
        >
          <span className="neu-flat flex h-9 w-9 items-center justify-center overflow-hidden rounded-full typo-caption-3 font-bold text-accent">
            <AvatarImage
              src={member.profileImageUrl}
              nickname={member.nickname}
            />
          </span>
          <span
            className={cn(
              "absolute -bottom-0.5 -right-0.5 size-2.5 rounded-full ring-2 ring-[var(--surface)]",
              online ? "bg-success-500" : "bg-place-h",
            )}
          />
        </button>
      ),
    };
  });

  if (hidden > 0) {
    items.push({
      key: "more",
      node: (
        <button
          type="button"
          onClick={onMemberClick}
          aria-label={`멤버 ${hidden}명 더 보기`}
          className="neu-flat flex h-9 w-9 items-center justify-center rounded-full typo-caption-3 font-semibold text-muted btn-spring hover:scale-110"
        >
          +{hidden}
        </button>
      ),
    });
  }

  return (
    <OrbitRing
      radius={wide ? 92 : 78}
      className={wide ? "h-56 w-56" : "h-48 w-48"}
      items={items}
      center={
        <>
          <div className="neu-float flex h-[84px] w-[84px] items-center justify-center overflow-hidden rounded-[28px] typo-h3 font-bold text-accent">
            <AvatarImage
              src={imageUrl}
              nickname={name}
              fallback={name.trim().charAt(0).toUpperCase()}
            />
          </div>

          {canEditImage && (
            <button
              type="button"
              onClick={onPickImage}
              aria-label="그룹 이미지 변경"
              className="neu-btn btn-spring absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full text-secondary hover:text-foreground"
            >
              <Camera size={12} strokeWidth={1.75} />
            </button>
          )}
        </>
      }
    />
  );
}
