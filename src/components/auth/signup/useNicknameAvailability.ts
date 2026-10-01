"use client";

import { useState } from "react";
import { isAxiosError } from "axios";

import { useNicknameCheck } from "@/src/hooks/querys/useMembers";
import { useOverlay } from "@/src/hooks/useOverlay";
import { getErrorMessage } from "@/src/types/ErrorResponse";

/**
 * 닉네임 중복 확인. 확인한 닉네임을 기억해서 값이 바뀌면 다시 확인하게 한다.
 * onTaken: 이미 쓰는 닉네임일 때 필드 에러를 붙일 콜백 (false 반환)
 */
export function useNicknameAvailability(
  nickname: string,
  onTaken: () => false,
) {
  const { openAlert } = useOverlay();
  const { refetch } = useNicknameCheck(nickname);
  const [checking, setChecking] = useState(false);
  const [checked, setChecked] = useState<string | null>(null);

  const available = !!nickname && nickname === checked;

  const check = async (): Promise<boolean> => {
    setChecking(true);
    try {
      const result = await refetch();
      if (result.error) throw result.error;
      if (!result.data) return onTaken();
      setChecked(nickname);
      return true;
    } catch (err) {
      if (isAxiosError(err) && err.response?.status === 409) return onTaken();
      openAlert({ title: "중복 확인 실패", message: getErrorMessage(err) });
      return false;
    } finally {
      setChecking(false);
    }
  };

  return { available, checking, check };
}
