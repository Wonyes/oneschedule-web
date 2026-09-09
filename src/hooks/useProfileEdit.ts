"use client";

import { useState } from "react";

import { useForm } from "@/src/hooks/useForm";
import {
  MyInfoChangeRequest,
  MyInfoResponse,
  useMyinfoChange,
  useNicknameCheck,
} from "@/src/hooks/querys/useMembers";
import { CustomError } from "../types/ErrorResponse";

export function useProfileEdit(user: MyInfoResponse) {
  const [editingField, setEditingField] = useState<
    "name" | "nickname" | "phoneNumber" | null
  >(null);

  const [nicknameChecked, setNicknameChecked] = useState(false);

  const { form, formChange, setForm, errors, setErrors, success, setSuccess } =
    useForm({
      name: user.name,
      nickname: user.nickname,
      phoneNumber: user.phoneNumber ?? "",
    });

  const { refetch: checkNickname } = useNicknameCheck(form.nickname);

  const { mutate: changeInfo } = useMyinfoChange();

  const startEdit = (field: "name" | "nickname" | "phoneNumber") => {
    setEditingField(field);

    if (field === "nickname") {
      setNicknameChecked(false);
    }

    setSuccess((prev) => ({ ...prev, [field]: "" }));
    setErrors((prev) => ({ ...prev, [field]: "" }));

    setForm({
      name: user.name,
      nickname: user.nickname,
      phoneNumber: user.phoneNumber ?? "",
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    formChange(e);

    if (e.target.name === "nickname") {
      setNicknameChecked(false);

      setSuccess({
        nickname: "",
      });

      setErrors({
        nickname: "",
      });
    }
  };

  const checkNicknameDuplicate = async () => {
    setNicknameChecked(false);

    setSuccess({
      nickname: "",
    });

    const result = await checkNickname();
    if (result.error) {
      const error = result.error as CustomError;

      setErrors({
        nickname: error?.response?.data?.message ?? "닉네임 확인 실패",
      });

      return;
    }

    if (!result.data) {
      setErrors({
        nickname: "이미 사용 중인 닉네임입니다.",
      });

      return;
    }

    setErrors({
      nickname: "",
    });

    setSuccess({
      nickname: "사용 가능한 닉네임입니다.",
    });

    setNicknameChecked(true);
  };

  const saveEdit = () => {
    if (!editingField) {
      return false;
    }

    if (editingField === "nickname" && !nicknameChecked) {
      setErrors((prev) => ({
        ...prev,
        nickname: "닉네임 중복 확인을 해주세요.",
      }));

      return false;
    }

    const field = editingField;
    const payload: MyInfoChangeRequest = { [field]: form[field] };

    changeInfo(payload, {
      onError: (error) => {
        setErrors((prev) => ({
          ...prev,
          [field]: error.response?.data?.message ?? "수정에 실패했습니다.",
        }));
      },

      onSuccess: () => {
        setEditingField(null);

        setNicknameChecked(false);

        setSuccess((prev) => ({ ...prev, [field]: "" }));
        setErrors((prev) => ({ ...prev, [field]: "" }));
      },
    });

    return true;
  };

  const cancelEdit = () => {
    setEditingField(null);

    setNicknameChecked(false);

    setForm({
      name: user.name,
      nickname: user.nickname,
      phoneNumber: user.phoneNumber ?? "",
    });

    setErrors({
      name: "",
      nickname: "",
      phoneNumber: "",
    });

    setSuccess({
      name: "",
      nickname: "",
      phoneNumber: "",
    });
  };

  return {
    form,

    errors,
    success,

    editingField,

    startEdit,
    handleChange,

    checkNicknameDuplicate,

    saveEdit,
    cancelEdit,
  };
}
