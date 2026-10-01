import { useState } from "react";

/** 값 + 필드별 에러. 입력하면 그 필드의 에러는 비워진다 */
export function useForm<T extends Record<string, unknown>>(initialValue?: T) {
  const [form, setForm] = useState<T>(initialValue ?? ({} as T));
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});

  const formChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const clearError = (name: keyof T) =>
    setErrors((prev) => ({ ...prev, [name]: "" }));

  return { form, errors, setForm, setErrors, formChange, clearError };
}
