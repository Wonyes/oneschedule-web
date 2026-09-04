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
  /** 새 일정을 개인/그룹 중 어디로 만들지. 시트를 연 곳(홈/그룹/스케줄 탭)의
   * 맥락으로 명시적으로 넘긴다 — 안 넘기면 전역 뷰 상태에 기대게 되어, 마지막으로
   * 봤던 탭이 엉뚱한 곳에서 열린 시트에도 남아 잘못된 곳에 등록되는 문제가 있었다. */
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
  /** 새 일정 생성 시에만 쓰인다. 어디를 편집 중인지와는 무관. */
  createType: ScheduleViewType;

  updateForm: (values: Partial<SheetForm>) => void;

  closeSheet: () => void;
  openSheet: (params?: OpenSheetParams) => void;
};

export const useSheetStore = create<SheetStore>((set) => ({
  open: false,
  form: initialForm,
  editingId: null,
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
    }),
}));
