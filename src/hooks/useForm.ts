import { useState } from "react";

export function useForm<T extends Record<string, unknown>>(initialValue?: T) {
  const [form, setForm] = useState(initialValue);

  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});

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
    setForm,
    resetForm,
    formChange,
    setErrors,
    clearError,
  };
}
