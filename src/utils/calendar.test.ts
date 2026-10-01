import { getDayState, getMonthGrid, pickRange } from "./calendar";

const d = (s: string) => new Date(`${s}T00:00:00`);

describe("getMonthGrid", () => {
  it("2026년 9월은 화요일 시작, 5주", () => {
    const grid = getMonthGrid(d("2026-09-15"));
    expect(grid).toHaveLength(5);
    expect(grid[0].slice(0, 2)).toEqual([null, null]);
    expect(grid[0][2]?.getDate()).toBe(1);
    expect(grid[4][3]?.getDate()).toBe(30);
    expect(grid[4].slice(4)).toEqual([null, null, null]);
  });

  it("모든 주가 7칸", () => {
    for (const week of getMonthGrid(d("2026-02-01"))) {
      expect(week).toHaveLength(7);
    }
  });
});

describe("getDayState", () => {
  const today = d("2026-09-17");

  it("오늘 이전은 disabled, 오늘은 가능", () => {
    expect(getDayState(d("2026-09-16"), null, null, today).disabled).toBe(true);
    expect(getDayState(d("2026-09-17"), null, null, today).disabled).toBe(
      false,
    );
  });

  it("이미 선택된 과거 날짜는 disabled가 아니다", () => {
    const start = d("2026-09-10");
    expect(getDayState(start, start, null, today)).toMatchObject({
      selected: true,
      disabled: false,
    });
  });

  it("시작·종료 사이는 inRange", () => {
    const state = getDayState(
      d("2026-09-20"),
      d("2026-09-18"),
      d("2026-09-22"),
      today,
    );
    expect(state).toEqual({ selected: false, inRange: true, disabled: false });
  });
});

describe("pickRange", () => {
  const a = d("2026-09-10");
  const b = d("2026-09-15");

  it("비어 있으면 시작일", () => {
    expect(pickRange(a, null, null)).toEqual({ startDate: a, endDate: null });
  });

  it("시작일 뒤를 누르면 종료일", () => {
    expect(pickRange(b, a, null)).toEqual({ startDate: a, endDate: b });
  });

  it("시작일 앞을 누르면 뒤집힌다", () => {
    expect(pickRange(a, b, null)).toEqual({ startDate: a, endDate: b });
  });

  it("범위가 완성돼 있으면 새 시작일", () => {
    const c = d("2026-09-20");
    expect(pickRange(c, a, b)).toEqual({ startDate: c, endDate: null });
  });

  it("시작일과 같은 날은 무시", () => {
    expect(pickRange(a, a, null)).toBeNull();
    expect(pickRange(a, a, a)).toBeNull(); // 하루짜리도 같은 취급
  });
});
