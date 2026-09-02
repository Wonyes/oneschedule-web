import { useRef } from "react";
import { Camera, Loader2 } from "lucide-react";
import BaseCard from "@/src/components/ui/card/BaseCard";
import { Column } from "@/src/components/ui/layout/flex";
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
            {user.imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={user.imageUrl}
                alt={user.nickname}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-accent/15 typo-h4 text-accent">
                {user.nickname[0]}
              </div>
            )}
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
      </Column>
    </BaseCard>
  );
}
