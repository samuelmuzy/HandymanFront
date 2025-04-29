import { useState, ChangeEvent, Dispatch, SetStateAction } from "react";

export const useForm = <T extends Record<string, unknown>>(initialState: T) => {
  const [form, setForm] = useState<T>(initialState);

  const onChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    setForm(prevForm => ({
      ...prevForm,
      [name]: value,
    }));
  };

  const resetForm = () => {
    setForm(initialState);
  };

  return [form, onChange, resetForm, setForm] as [
    T,
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void,
    () => void,
    Dispatch<SetStateAction<T>>
  ];
};
