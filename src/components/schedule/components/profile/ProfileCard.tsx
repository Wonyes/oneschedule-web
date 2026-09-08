import { useRef } from "react";
import { Camera, Crown, Loader2, Mail, Users } from "lucide-react";
import AvatarImage from "@/src/components/common/AvatarImage";
import GoogleMark from "@/src/components/common/GoogleMark";
import BaseCard from "@/src/components/ui/card/BaseCard";
import { Column, Row } from "@/src/components/ui/layout/flex";
import { useActiveGroup } from "@/src/hooks/querys/useGroup";
import {
  MyInfoResponse,
  useProfileImageUpload,
} from "@/src/hooks/querys/useMembers";
import { useOverlay } from "@/src/hooks/useOverlay";
import { getErrorMessage } from "@/src/types/ErrorResponse";

export default function ProfileCard({ user }: { user: MyInfoResponse }) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { mutate: uploadImage, isPending } = useProfileImageUpload();
  const { openToast } = useOverlay();
  const { groups } = useActiveGroup();

  const adminCount = groups.filter((g) => g.groupRole === "SUPER").length;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    uploadImage(file, {
      onError: (err) => {
        openToast({ message: getErrorMessage(err) });
      },
    });
  };

  return (
    <BaseCard className="p-8" glow>
      <Column className="items-center text-center">
        <div className="relative">
          <div className="h-20 w-20 overflow-hidden rounded-full neu-flat">
            <AvatarImage
              src={user.profileImageUrl}
              nickname={user.nickname}
              fallback={
                <div className="flex h-full w-full items-center justify-center bg-accent/15 typo-h4 text-accent">
                  {user.nickname[0]}
                </div>
              }
            />
          </div>

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isPending}
            className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full neu-btn"
            aria-label="프로필 사진 변경"
          >
            {isPending ? (
              <Loader2 size={13} className="animate-spin text-accent" />
            ) : (
              <Camera size={13} strokeWidth={1.75} />
            )}
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>

        <h1 className="mt-4 typo-h4 text-foreground">{user.nickname}</h1>

        <p className="mt-1 typo-sub-t-2 text-muted">{user.name}</p>

        <p className="typo-caption-3 text-place-h mt-0.5">{user.email}</p>

        <Row className="mt-4 flex-wrap justify-center gap-1.5">
          <Row className="neu-flat gap-1.5 rounded-full px-3 py-1.5">
            {user.provider === "GOOGLE" ? (
              <GoogleMark size={12} />
            ) : (
              <Mail size={12} strokeWidth={1.75} className="text-accent" />
            )}
            <span className="typo-caption-3 text-secondary">
              {user.provider === "GOOGLE" ? "Google 로그인" : "이메일 로그인"}
            </span>
          </Row>

          <Row className="neu-flat gap-1.5 rounded-full px-3 py-1.5">
            <Users size={12} strokeWidth={1.75} className="text-accent" />
            <span className="typo-caption-3 text-secondary">
              그룹 {groups.length}개
            </span>
          </Row>

          {adminCount > 0 && (
            <Row className="neu-flat gap-1.5 rounded-full px-3 py-1.5">
              <Crown
                size={12}
                strokeWidth={1.75}
                className="text-pending-500"
              />
              <span className="typo-caption-3 text-secondary">
                관리자 {adminCount}곳
              </span>
            </Row>
          )}
        </Row>
      </Column>
    </BaseCard>
  );
}
