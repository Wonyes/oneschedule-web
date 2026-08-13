"use client";

import { useState } from "react";

import { useForm } from "@/src/hooks/useForm";
import {
  MyInfoResponse,
  useMyinfoChange,
  useNicknameCheck,
} from "@/src/hooks/querys/useMembers";
import { CustomError } from "../types/ErrorResponse";

export function useProfileEdit(user: MyInfoResponse) {
  const [editingField, setEditingField] = useState<
    "nickname" | "phoneNumber" | null
  >(null);

  const [nicknameChecked, setNicknameChecked] = useState(false);

  const { form, formChange, setForm, errors, setErrors, success, setSuccess } =
    useForm({
      nickname: user.nickname,
      phoneNumber: user.phoneNumber,
    });

  const { refetch: checkNickname } = useNicknameCheck(form.nickname);

  const { mutate: changeInfo } = useMyinfoChange();

  const startEdit = (field: "nickname" | "phoneNumber") => {
    setEditingField(field);

    if (field === "nickname") {
      setNicknameChecked(false);

      setSuccess({
        nickname: "",
      });

      setErrors({
        nickname: "",
      });
    }

    setForm({
      nickname: user.nickname,
      phoneNumber: user.phoneNumber,
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
        nickname: error?.response.data?.message ?? "닉네임 확인 실패",
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
    if (editingField === "nickname" && !nicknameChecked) {
      setErrors({
        nickname: "닉네임 중복 확인을 해주세요.",
      });

      return false;
    }

    changeInfo(
      {
        nickname: form.nickname,
        phoneNumber: form.phoneNumber,
      },
      {
        onError: (error) => {
          if (editingField) {
            setErrors({
              [editingField]: error.response.data.message,
            });
          }
        },

        onSuccess: () => {
          setEditingField(null);

          setNicknameChecked(false);

          setSuccess({
            nickname: "",
            phoneNumber: "",
          });
        },
      },
    );

    return true;
  };

  const cancelEdit = () => {
    setEditingField(null);

    setNicknameChecked(false);

    setForm({
      nickname: user.nickname,
      phoneNumber: user.phoneNumber,
    });

    setErrors({
      nickname: "",
      phoneNumber: "",
    });

    setSuccess({
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
