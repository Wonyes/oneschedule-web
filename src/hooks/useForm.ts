import { useState } from "react";

export function useForm<T extends Record<string, unknown>>(initialValue?: T) {
  const [form, setForm] = useState<T>(initialValue ?? ({} as T));

  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [success, setSuccess] = useState<Partial<Record<keyof T, string>>>({});

  const formChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));

    setSuccess((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const resetForm = (value: T) => {
    setForm(value);
    setErrors({});
  };

  const clearError = (name: keyof T) => {
    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  return {
    form,
    errors,
    success,
    setForm,
    setSuccess,
    resetForm,
    formChange,
    setErrors,
    clearError,
  };
}
