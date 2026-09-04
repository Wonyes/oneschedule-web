import { useSheetStore } from "./useSheetStore";
import { ScheduleEvent } from "@/src/types/schedule";

const event = (overrides: Partial<ScheduleEvent> = {}): ScheduleEvent => ({
  id: 1,
  title: "회의",
  startDate: "2024-01-17T09:00:00",
  endDate: "2024-01-17T10:00:00",
  category: "personal",
  createdAt: "2024-01-01T00:00:00",
  author: { memberNo: 1, nickname: "테스터" },
  ...overrides,
});

describe("useSheetStore", () => {
  beforeEach(() => {
    useSheetStore.getState().closeSheet();
  });

  test("type을 안 넘기면 createType은 PERSONAL로 기본값 처리된다", () => {
    useSheetStore.getState().openSheet({ date: new Date() });

    expect(useSheetStore.getState().createType).toBe("PERSONAL");
    expect(useSheetStore.getState().open).toBe(true);
    expect(useSheetStore.getState().editingId).toBeNull();
  });

  test("type: GROUP을 넘기면 createType이 GROUP이 된다", () => {
    useSheetStore.getState().openSheet({ date: new Date(), type: "GROUP" });

    expect(useSheetStore.getState().createType).toBe("GROUP");
  });

  test("연속으로 다른 곳에서 열면 이전 createType이 남지 않는다", () => {
    useSheetStore.getState().openSheet({ date: new Date(), type: "GROUP" });
    expect(useSheetStore.getState().createType).toBe("GROUP");

    useSheetStore.getState().closeSheet();
    useSheetStore.getState().openSheet({ date: new Date(), type: "PERSONAL" });

    expect(useSheetStore.getState().createType).toBe("PERSONAL");
  });

  test("event를 넘기면 수정 모드로 열리고 폼이 이벤트 값으로 채워진다", () => {
    const target = event({ id: 42, title: "일정 수정 대상" });

    useSheetStore.getState().openSheet({ event: target });

    const state = useSheetStore.getState();
    expect(state.editingId).toBe(42);
    expect(state.form.title).toBe("일정 수정 대상");
    expect(state.form.startTime).toBe("09:00");
    expect(state.form.endTime).toBe("10:00");
  });

  test("closeSheet은 open/폼/editingId를 초기화한다", () => {
    useSheetStore.getState().openSheet({ event: event() });
    useSheetStore.getState().closeSheet();

    const state = useSheetStore.getState();
    expect(state.open).toBe(false);
    expect(state.editingId).toBeNull();
    expect(state.form.title).toBe("");
  });

  test("updateForm은 넘긴 필드만 병합한다", () => {
    useSheetStore.getState().openSheet({ date: new Date() });
    useSheetStore.getState().updateForm({ title: "새 제목" });

    const state = useSheetStore.getState();
    expect(state.form.title).toBe("새 제목");
    expect(state.form.content).toBe("");
  });
});
