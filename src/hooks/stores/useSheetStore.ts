import { EventCategory } from "@/src/types/schedule";
import { formatTime } from "@/src/utils/time";
import { create } from "zustand";

type OpenSheetParams = {
  date?: Date;
  startTime?: string;
  endTime?: string;
};

type SheetForm = {
  title: string;

  endDate: Date | null;
  startDate: Date | null;

  startTime: string;
  endTime: string;
  category: EventCategory | "";
  content: string;
};

const initialForm: SheetForm = {
  title: "",

  endDate: null,
  startDate: null,

  endTime: "",
  startTime: "",

  category: "",
  content: "",
};

type SheetStore = {
  open: boolean;

  form: SheetForm;

  updateForm: (values: Partial<SheetForm>) => void;

  closeSheet: () => void;
  openSheet: (params?: OpenSheetParams) => void;
};

export const useSheetStore = create<SheetStore>((set) => ({
  open: false,
  form: initialForm,

  updateForm: (values) =>
    set((state) => ({
      form: {
        ...state.form,
        ...values,
      },
    })),

  openSheet: ({ date, startTime, endTime } = {}) =>
    set({
      open: true,
      form: {
        ...initialForm,

        startDate: date ?? null,
        endDate: null,

        startTime: formatTime(startTime ?? ""),
        endTime: formatTime(endTime ?? ""),
      },
    }),

  closeSheet: () =>
    set({
      open: false,
      form: initialForm,
    }),
}));
