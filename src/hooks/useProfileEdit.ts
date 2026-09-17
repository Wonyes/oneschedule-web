"use client";

import { useState } from "react";

import { useForm } from "@/src/hooks/useForm";
import {
  MyInfoChangeRequest,
  MyInfoResponse,
  useMyinfoChange,
  useNicknameCheck,
} from "@/src/hooks/querys/useMembers";
import { CustomError, getErrorMessage } from "../types/ErrorResponse";

type EditField = "name" | "nickname" | "phoneNumber";

/** 프로필 필드를 하나씩 인라인 편집. 닉네임은 저장 전 중복 확인이 필요하다 */
export function useProfileEdit(user: MyInfoResponse) {
  const initial = () => ({
    name: user.name,
    nickname: user.nickname,
    phoneNumber: user.phoneNumber ?? "",
  });

  const [editingField, setEditingField] = useState<EditField | null>(null);
  const [nicknameChecked, setNicknameChecked] = useState(false);
  /** 중복 확인 통과 메시지. 닉네임에만 있다 */
  const [nicknameSuccess, setNicknameSuccess] = useState("");
  const { form, formChange, setForm, errors, setErrors } = useForm(initial());

  const { refetch: checkNickname } = useNicknameCheck(form.nickname);
  const { mutate: changeInfo } = useMyinfoChange();

  /** 편집 시작·취소·저장 완료 때 공통: 값은 서버 값으로, 메시지는 비우고 */
  const reset = () => {
    setForm(initial());
    setErrors({});
    setNicknameSuccess("");
    setNicknameChecked(false);
  };

  const startEdit = (field: EditField) => {
    reset();
    setEditingField(field);
  };

  const cancelEdit = () => {
    reset();
    setEditingField(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    formChange(e);
    if (e.target.name === "nickname") {
      setNicknameChecked(false);
      setNicknameSuccess("");
    }
  };

  const checkNicknameDuplicate = async () => {
    setNicknameChecked(false);
    setNicknameSuccess("");

    const result = await checkNickname();

    if (result.error) {
      return setErrors({
        nickname: getErrorMessage(
          result.error as CustomError,
          "닉네임 확인 실패",
        ),
      });
    }
    if (!result.data) {
      return setErrors({ nickname: "이미 사용 중인 닉네임입니다." });
    }

    setErrors({});
    setNicknameSuccess("사용 가능한 닉네임입니다.");
    setNicknameChecked(true);
  };

  const saveEdit = () => {
    if (!editingField) return false;

    if (editingField === "nickname" && !nicknameChecked) {
      setErrors({ nickname: "닉네임 중복 확인을 해주세요." });
      return false;
    }

    const field = editingField;
    const payload: MyInfoChangeRequest = { [field]: form[field] };

    changeInfo(payload, {
      onSuccess: () => {
        reset();
        setEditingField(null);
      },
      onError: (err) =>
        setErrors({ [field]: getErrorMessage(err, "수정에 실패했습니다.") }),
    });

    return true;
  };

  return {
    form,
    errors,
    nicknameSuccess,
    editingField,
    startEdit,
    handleChange,
    checkNicknameDuplicate,
    saveEdit,
    cancelEdit,
  };
}
