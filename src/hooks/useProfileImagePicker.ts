"use client";

import { useRef } from "react";

import { useGroupProfileImageUpload } from "@/src/hooks/querys/useGroup";
import { useProfileImageUpload } from "@/src/hooks/querys/useMembers";
import { useOverlay } from "@/src/hooks/useOverlay";
import { CustomError, getErrorMessage } from "@/src/types/ErrorResponse";

type UploadOptions = { onError: (err: CustomError) => void };

export type ProfileImagePicker = ReturnType<typeof usePicker>;

/** 숨김 file input + 열기. 고른 파일은 upload로 넘기고 실패는 토스트로 알린다 */
function usePicker(
  upload: (file: File, options: UploadOptions) => void,
  isPending: boolean,
) {
  const ref = useRef<HTMLInputElement>(null);
  const { openToast } = useOverlay();

  const inputProps = {
    ref,
    type: "file",
    accept: "image/*",
    className: "hidden",
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      e.target.value = ""; // 같은 파일 다시 골라도 change가 나게
      if (!file) return;
      upload(file, {
        onError: (err) => openToast({ message: getErrorMessage(err) }),
      });
    },
  } as const;

  return { open: () => ref.current?.click(), inputProps, isPending };
}

/** 내 프로필 사진 */
export function useMemberImagePicker() {
  const { mutate, isPending } = useProfileImageUpload();
  return usePicker((file, options) => mutate(file, options), isPending);
}

/** 그룹 이미지 */
export function useGroupImagePicker(groupNo: number) {
  const { mutate, isPending } = useGroupProfileImageUpload();
  return usePicker(
    (file, options) => mutate({ file, groupNo }, options),
    isPending,
  );
}
