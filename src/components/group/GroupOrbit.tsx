"use client";

import { Camera } from "lucide-react";
import { motion } from "motion/react";

import AvatarImage from "@/src/components/common/AvatarImage";
import { GroupMember, MemberPresence } from "@/src/types/group";
import { cn } from "@/src/utils/cn";

const MAX_SATELLITES = 6;
const RADIUS = 92;

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
  const shown = members.slice(0, MAX_SATELLITES);
  const hidden = members.length - shown.length;
  const slots = hidden > 0 ? shown.length + 1 : shown.length;

  const place = (index: number) => {
    const angle = (index / slots) * 360 - 90;
    return {
      transform: `rotate(${angle}deg) translateX(${RADIUS}px) rotate(${-angle}deg)`,
    };
  };

  return (
    <div className="relative mx-auto flex h-56 w-56 shrink-0 items-center justify-center">
      <div className="absolute inset-0 rounded-full bg-accent/15 blur-3xl" />
      <div className="neu-pressed absolute inset-3 rounded-full" />
      <motion.div
        aria-hidden
        className="absolute inset-[19%] rounded-full border border-dashed border-divider"
        animate={{ rotate: 360 }}
        transition={{ duration: 120, ease: "linear", repeat: Infinity }}
      />

      <div className="relative z-10">
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
            className="neu-btn btn-spring absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full text-secondary hover:text-foreground"
          >
            <Camera size={12} strokeWidth={1.75} />
          </button>
        )}
      </div>

      {shown.map((member, i) => {
        const online = presence?.get(member.memberNo)?.online ?? false;

        return (
          <div
            key={member.memberNo}
            className="absolute left-1/2 top-1/2"
            style={place(i)}
          >
            <button
              type="button"
              onClick={onMemberClick}
              title={`${member.nickname}${online ? " · 온라인" : ""}`}
              className="relative block -translate-x-1/2 -translate-y-1/2 btn-spring hover:scale-110"
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
          </div>
        );
      })}

      {hidden > 0 && (
        <div className="absolute left-1/2 top-1/2" style={place(shown.length)}>
          <button
            type="button"
            onClick={onMemberClick}
            aria-label={`멤버 ${hidden}명 더 보기`}
            className="neu-flat flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full typo-caption-3 font-semibold text-muted btn-spring hover:scale-110"
          >
            +{hidden}
          </button>
        </div>
      )}
    </div>
  );
}
