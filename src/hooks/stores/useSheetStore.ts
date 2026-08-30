import { EventCategory, ScheduleEvent } from "@/src/types/schedule";
import { formatTime } from "@/src/utils/time";
import { format } from "date-fns";
import { create } from "zustand";

type OpenSheetParams = {
  date?: Date;
  startTime?: string;
  endTime?: string;
  event?: ScheduleEvent;
};

type SheetForm = {
  title: string;

  endDate: Date | null;
  startDate: Date | null;

  startTime: string;
  endTime: string;
  category: EventCategory | "";
  content: string;
  participantMemberNos: number[];
};

const initialForm: SheetForm = {
  title: "",

  endDate: null,
  startDate: null,

  endTime: "",
  startTime: "",

  category: "",
  content: "",
  participantMemberNos: [],
};

type SheetStore = {
  open: boolean;

  form: SheetForm;
  editingId: number | null;

  updateForm: (values: Partial<SheetForm>) => void;

  closeSheet: () => void;
  openSheet: (params?: OpenSheetParams) => void;
};

export const useSheetStore = create<SheetStore>((set) => ({
  open: false,
  form: initialForm,
  editingId: null,

  updateForm: (values) =>
    set((state) => ({
      form: {
        ...state.form,
        ...values,
      },
    })),

  openSheet: ({ date, startTime, endTime, event } = {}) => {
    if (event) {
      const start = new Date(event.startDate);
      const end = new Date(event.endDate);

      set({
        open: true,
        editingId: event.id,
        form: {
          title: event.title,
          startDate: start,
          endDate: end,
          startTime: format(start, "HH:mm"),
          endTime: format(end, "HH:mm"),
          category: event.category,
          content: event.content ?? "",
          participantMemberNos: event.participantMemberNos ?? [],
        },
      });
      return;
    }

    set({
      open: true,
      editingId: null,
      form: {
        ...initialForm,

        startDate: date ?? null,
        endDate: null,

        startTime: formatTime(startTime ?? ""),
        endTime: formatTime(endTime ?? ""),
      },
    });
  },

  closeSheet: () =>
    set({
      open: false,
      form: initialForm,
      editingId: null,
    }),
}));
