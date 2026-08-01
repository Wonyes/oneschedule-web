import { useState } from "react";

export function useForm<T extends Record<string, unknown>>(initialValue?: T) {
  const [form, setForm] = useState(initialValue);

  const formChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return {
    form,
    setForm,
    formChange,
  };
}
