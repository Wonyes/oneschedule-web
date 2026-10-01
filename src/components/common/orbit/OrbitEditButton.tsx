"use client";

import { Camera, Loader2 } from "lucide-react";

import { ProfileImagePicker } from "@/src/hooks/useProfileImagePicker";

/** 오빗 중앙 우하단 이미지 변경 버튼 + 숨김 file input. center 래퍼가 relative여야 한다 */
export default function OrbitEditButton({
  label,
  picker,
}: {
  label: string;
  picker: ProfileImagePicker;
}) {
  return (
    <>
      <button
        type="button"
        onClick={picker.open}
        disabled={picker.isPending}
        aria-label={label}
        className="neu-btn btn-spring absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full text-secondary hover:text-foreground"
      >
        {picker.isPending ? (
          <Loader2 size={13} className="animate-spin text-accent" />
        ) : (
          <Camera size={13} strokeWidth={1.75} />
        )}
      </button>
      <input {...picker.inputProps} />
    </>
  );
}
