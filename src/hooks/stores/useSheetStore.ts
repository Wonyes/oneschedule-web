import {
  EventCategory,
  ScheduleEvent,
  ScheduleViewType,
} from "@/src/types/schedule";
import { formatTime } from "@/src/utils/time";
import { format } from "date-fns";
import { create } from "zustand";

type OpenSheetParams = {
  date?: Date;
  startTime?: string;
  endTime?: string;
  event?: ScheduleEvent;
  type?: ScheduleViewType;
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
  /** 수정 중인 일정의 작성자. 수정·삭제 권한 판단에 쓴다. */
  editingAuthorNo: number | null;
  createType: ScheduleViewType;

  updateForm: (values: Partial<SheetForm>) => void;

  closeSheet: () => void;
  openSheet: (params?: OpenSheetParams) => void;
};

export const useSheetStore = create<SheetStore>((set) => ({
  open: false,
  form: initialForm,
  editingId: null,
  editingAuthorNo: null,
  createType: "PERSONAL",

  updateForm: (values) =>
    set((state) => ({
      form: {
        ...state.form,
        ...values,
      },
    })),

  openSheet: ({ date, startTime, endTime, event, type } = {}) => {
    if (event) {
      const start = new Date(event.startDate);
      const end = new Date(event.endDate);

      set({
        open: true,
        editingId: event.id,
        editingAuthorNo: event.author?.memberNo ?? event.createdBy ?? null,
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
      editingAuthorNo: null,
      createType: type ?? "PERSONAL",
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
      editingAuthorNo: null,
    }),
}));
