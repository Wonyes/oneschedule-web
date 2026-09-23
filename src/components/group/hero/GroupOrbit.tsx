"use client";

import AvatarImage from "@/src/components/common/AvatarImage";
import MemberAvatar from "@/src/components/common/MemberAvatar";
import PresenceDot from "@/src/components/common/PresenceDot";
import { getPresence } from "@/src/utils/presence";
import OrbitRing, {
  OrbitItem,
  splitSatellites,
} from "@/src/components/common/orbit/OrbitRing";
import OrbitMore from "@/src/components/common/orbit/OrbitMore";
import OrbitEditButton from "@/src/components/common/orbit/OrbitEditButton";
import { ProfileImagePicker } from "@/src/hooks/useProfileImagePicker";
import { GroupMember, MemberPresence } from "@/src/types/group";

const MAX_SATELLITES = 6;

export default function GroupOrbit({
  name,
  imageUrl,
  members,
  presence,
  picker,
  onMemberClick,
}: {
  name: string;
  imageUrl?: string | null;
  members: GroupMember[];
  presence?: Map<number, MemberPresence>;
  /** 있으면 이미지 변경 버튼이 보인다 */
  picker?: ProfileImagePicker;
  onMemberClick?: () => void;
}) {
  const { shown, hidden } = splitSatellites(members, MAX_SATELLITES);

  const items: OrbitItem[] = shown.map((member) => {
    const { online, label } = getPresence(presence, member.memberNo);

    return {
      key: member.memberNo,
      node: (
        <button
          type="button"
          onClick={onMemberClick}
          title={`${member.nickname} · ${label}`}
          className="relative block btn-spring hover:scale-110"
        >
          <MemberAvatar
            nickname={member.nickname}
            src={member.profileImageUrl}
          />
          <PresenceDot online={online} />
        </button>
      ),
    };
  });

  if (hidden > 0) {
    items.push({
      key: "more",
      node: (
        <OrbitMore
          count={hidden}
          label={`멤버 ${hidden}명 더 보기`}
          onClick={onMemberClick}
        />
      ),
    });
  }

  return (
    <OrbitRing
      size="sm"
      wideSize="lg"
      items={items}
      center={
        <>
          <div className="neu-float flex h-[84px] w-[84px] items-center justify-center overflow-hidden rounded-[28px] typo-h4 font-bold text-accent">
            <AvatarImage
              src={imageUrl}
              nickname={name}
              fallback={name.trim().charAt(0).toUpperCase()}
            />
          </div>

          {picker && (
            <OrbitEditButton label="그룹 이미지 변경" picker={picker} />
          )}
        </>
      }
    />
  );
}
