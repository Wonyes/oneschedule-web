import {
  getWeekDates,
  isSameDate,
  findHoliday,
  getDayColor,
  getWeatherIcon,
  getmonthTime,
  getMonthDates,
  getEventPosition,
  getWeekEvents,
  markConflicts,
} from "./schedule";
import { ScheduleEvent, holidayType } from "../types/schedule";

const holiday = (locdate: string, dateName = "테스트 공휴일"): holidayType => ({
  id: 1,
  dateName,
  isHoliday: "Y",
  locdate,
});

const event = (
  overrides: Partial<ScheduleEvent> & Pick<ScheduleEvent, "id">,
): ScheduleEvent => ({
  title: "이벤트",
  startDate: "2024-01-17T09:00:00",
  endDate: "2024-01-17T10:00:00",
  category: "personal",
  createdAt: "2024-01-01T00:00:00",
  author: { memberNo: 1, nickname: "테스터" },
  ...overrides,
});

describe("getWeekDates", () => {
  test("월요일 시작으로 7일을 반환한다", () => {
    // 2024-01-17 은 수요일
    const dates = getWeekDates(new Date(2024, 0, 17));

    expect(dates).toHaveLength(7);
    expect(dates[0]).toEqual(new Date(2024, 0, 15)); // Mon
    expect(dates[6]).toEqual(new Date(2024, 0, 21)); // Sun
  });
});

describe("isSameDate", () => {
  test("dateB가 없으면 false", () => {
    expect(isSameDate("2024-01-01", undefined)).toBe(false);
  });

  test("같은 날짜면 true", () => {
    expect(isSameDate("2024-01-01T15:00:00", new Date(2024, 0, 1))).toBe(true);
  });

  test("다른 날짜면 false", () => {
    expect(isSameDate("2024-01-01", new Date(2024, 0, 2))).toBe(false);
  });
});

describe("findHoliday", () => {
  const target = new Date(2024, 0, 1);

  test("holidays가 없으면 undefined", () => {
    expect(findHoliday(target, undefined as unknown as holidayType[])).toBe(
      undefined,
    );
  });

  test("단일 객체로 넘겨도 매칭되면 반환한다", () => {
    const h = holiday("20240101");
    expect(findHoliday(target, h)).toBe(h);
  });

  test("배열에서 일치하는 항목을 찾는다", () => {
    const match = holiday("20240101", "신정");
    const list = [holiday("20241225", "크리스마스"), match];

    expect(findHoliday(target, list)).toBe(match);
  });

  test("일치하는 항목이 없으면 undefined", () => {
    const list = [holiday("20241225", "크리스마스")];
    expect(findHoliday(target, list)).toBe(undefined);
  });
});

describe("getDayColor", () => {
  test("공휴일이면 다른 조건보다 우선한다", () => {
    const sunday = new Date(2024, 0, 7); // Sun
    expect(getDayColor(sunday, holiday("20240107"))).toBe("text-red-800");
  });

  test("일요일이면 text-red-600", () => {
    expect(getDayColor(new Date(2024, 0, 7), undefined)).toBe("text-red-600");
  });

  test("토요일이면 text-blue-600", () => {
    expect(getDayColor(new Date(2024, 0, 6), undefined)).toBe("text-blue-600");
  });

  test("평일이면 text-muted", () => {
    expect(getDayColor(new Date(2024, 0, 8), undefined)).toBe("text-muted");
  });
});

describe("getWeatherIcon", () => {
  test("강수형태가 있으면 비/눈 아이콘을 사용한다", () => {
    expect(getWeatherIcon("1", "1")).toBe("🌧️");
    expect(getWeatherIcon("3", "1")).toBe("❄️");
  });

  test("알 수 없는 강수코드는 빈 문자열", () => {
    expect(getWeatherIcon("9", "1")).toBe("");
  });

  test("강수형태가 없으면(pty=0) 하늘상태 아이콘을 사용한다", () => {
    expect(getWeatherIcon("0", "1")).toBe("☀️");
    expect(getWeatherIcon("0", "4")).toBe("☁️");
  });

  test("알 수 없는 하늘상태 코드는 빈 문자열", () => {
    expect(getWeatherIcon("0", "2")).toBe("");
  });
});

describe("getmonthTime", () => {
  test("당일 일정이면 시작~종료 시간을 그대로 보여준다", () => {
    const result = getmonthTime(
      "2024-01-17T09:00:00",
      "2024-01-17T11:00:00",
      new Date(2024, 0, 17),
    );
    expect(result).toBe("09:00 - 11:00");
  });

  test("여러 날짜에 걸친 일정의 시작일에는 '~ 끝'을 보여준다", () => {
    const result = getmonthTime(
      "2024-01-17T09:00:00",
      "2024-01-19T11:00:00",
      new Date(2024, 0, 17),
    );
    expect(result).toBe("09:00 ~ 끝");
  });

  test("여러 날짜에 걸친 일정의 종료일에는 '시작 ~'을 보여준다", () => {
    const result = getmonthTime(
      "2024-01-17T09:00:00",
      "2024-01-19T11:00:00",
      new Date(2024, 0, 19),
    );
    expect(result).toBe("시작 ~ 11:00");
  });

  test("중간 날짜에는 '진행 중'을 보여준다", () => {
    const result = getmonthTime(
      "2024-01-17T09:00:00",
      "2024-01-19T11:00:00",
      new Date(2024, 0, 18),
    );
    expect(result).toBe("진행 중");
  });
});

describe("getMonthDates", () => {
  test("월 시작/종료가 주 경계와 딱 맞으면 4주(28일)를 반환한다", () => {
    // 2021-02: 2/1 Mon ~ 2/28 Sun
    const dates = getMonthDates(new Date(2021, 1, 15));
    expect(dates).toHaveLength(28);
    expect(dates[0]).toEqual(new Date(2021, 1, 1));
    expect(dates[dates.length - 1]).toEqual(new Date(2021, 1, 28));
  });

  test("월 앞뒤로 여백이 생기면 6주(42일)까지 채운다", () => {
    // 2021-05: 5/1 Sat ~ 5/31 Mon
    const dates = getMonthDates(new Date(2021, 4, 15));
    expect(dates).toHaveLength(42);
    expect(dates[0]).toEqual(new Date(2021, 3, 26)); // 그리드 시작 Mon
    expect(dates[dates.length - 1]).toEqual(new Date(2021, 5, 6)); // 그리드 끝 Sun
  });
});

describe("getEventPosition", () => {
  test("자정 기준 경과 시간을 하루(1440분) 대비 비율(%)로 변환한다", () => {
    const dayStart = new Date(2024, 0, 1, 0, 0);
    const displayStart = new Date(2024, 0, 1, 1, 0); // 60분 경과
    const displayEnd = new Date(2024, 0, 1, 2, 0); // 60분 길이

    const { top, height } = getEventPosition(
      displayStart,
      displayEnd,
      dayStart,
    );

    expect(top).toBeCloseTo((60 / 1440) * 100);
    expect(height).toBeCloseTo((60 / 1440) * 100);
  });
});

describe("getWeekEvents (겹치는 일정 레이아웃)", () => {
  test("같은 시간대에 겹치는 일정은 폭을 나눠 갖는다", () => {
    const weekDates = getWeekDates(new Date(2024, 0, 17));

    const events: ScheduleEvent[] = [
      event({
        id: 1,
        startDate: "2024-01-17T09:00:00",
        endDate: "2024-01-17T10:00:00",
      }),
      event({
        id: 2,
        startDate: "2024-01-17T09:00:00",
        endDate: "2024-01-17T10:00:00",
      }),
    ];

    const layouts = getWeekEvents(events, weekDates);

    expect(layouts).toHaveLength(2);
    layouts.forEach((layout) => {
      expect(layout.width).toBe(50);
    });
    expect(new Set(layouts.map((l) => l.left))).toEqual(new Set([0, 50]));
  });

  test("겹치지 않는 일정은 폭 100%를 그대로 갖는다", () => {
    const weekDates = getWeekDates(new Date(2024, 0, 17));

    const events: ScheduleEvent[] = [
      event({
        id: 1,
        startDate: "2024-01-17T09:00:00",
        endDate: "2024-01-17T10:00:00",
      }),
      event({
        id: 2,
        startDate: "2024-01-18T09:00:00",
        endDate: "2024-01-18T10:00:00",
      }),
    ];

    const layouts = getWeekEvents(events, weekDates);

    layouts.forEach((layout) => {
      expect(layout.width).toBe(100);
      expect(layout.left).toBe(0);
    });
  });

  test("A-B, B-C만 겹치는 체인에서도 폭과 위치가 어긋나지 않는다", () => {
    const weekDates = getWeekDates(new Date(2024, 0, 17));

    // A(09:00~10:00) - B(09:30~11:00) - C(10:30~12:00)
    // A와 C는 서로 겹치지 않지만 B를 통해 한 덩어리로 묶인다.
    const events: ScheduleEvent[] = [
      event({
        id: 1,
        startDate: "2024-01-17T09:00:00",
        endDate: "2024-01-17T10:00:00",
      }),
      event({
        id: 2,
        startDate: "2024-01-17T09:30:00",
        endDate: "2024-01-17T11:00:00",
      }),
      event({
        id: 3,
        startDate: "2024-01-17T10:30:00",
        endDate: "2024-01-17T12:00:00",
      }),
    ];

    const layouts = getWeekEvents(events, weekDates);

    // 같은 덩어리이므로 모두 같은 폭(2열)을 갖는다
    layouts.forEach((layout) => {
      expect(layout.width).toBe(50);
    });

    const byId = (id: number) => layouts.find((l) => l.event.id === id)!;

    // A와 C는 겹치지 않으므로 같은 열을 재사용하고, B만 다른 열로 밀린다
    expect(byId(1).left).toBe(0);
    expect(byId(2).left).toBe(50);
    expect(byId(3).left).toBe(0);
  });

  test("겹치는 일정끼리는 서로 침범하지 않는다", () => {
    const weekDates = getWeekDates(new Date(2024, 0, 17));

    const events: ScheduleEvent[] = [
      event({
        id: 1,
        startDate: "2024-01-17T09:00:00",
        endDate: "2024-01-17T11:00:00",
      }),
      event({
        id: 2,
        startDate: "2024-01-17T09:30:00",
        endDate: "2024-01-17T10:30:00",
      }),
      event({
        id: 3,
        startDate: "2024-01-17T10:00:00",
        endDate: "2024-01-17T12:00:00",
      }),
    ];

    const layouts = getWeekEvents(events, weekDates);

    // 셋 다 서로 겹치므로 3열로 나뉘고, 가로 구간이 겹치면 안 된다
    layouts.forEach((a) => {
      layouts
        .filter((b) => b.event.id !== a.event.id)
        .forEach((b) => {
          const verticallyOverlaps =
            a.top < b.top + b.height && a.top + a.height > b.top;

          if (!verticallyOverlaps) return;

          const aRight = a.left! + a.width!;
          const bRight = b.left! + b.width!;
          const horizontallyOverlaps = a.left! < bRight && aRight > b.left!;

          expect(horizontallyOverlaps).toBe(false);
        });
    });
  });
});

describe("markConflicts (개인/그룹 일정 겹침 표시)", () => {
  test("반대쪽 목록과 시간이 겹치면 hasConflict가 붙는다", () => {
    const personal = [
      event({
        id: 1,
        startDate: "2024-01-17T09:00:00",
        endDate: "2024-01-17T10:00:00",
      }),
      event({
        id: 2,
        startDate: "2024-01-17T13:00:00",
        endDate: "2024-01-17T14:00:00",
      }),
    ];

    const group = [
      event({
        id: 10,
        startDate: "2024-01-17T09:30:00",
        endDate: "2024-01-17T10:30:00",
      }),
    ];

    const marked = markConflicts(personal, group);

    expect(marked.find((e) => e.id === 1)?.hasConflict).toBe(true);
    expect(marked.find((e) => e.id === 2)?.hasConflict).toBe(false);
  });

  test("맞닿기만 한 일정은 겹침으로 보지 않는다", () => {
    const personal = [
      event({
        id: 1,
        startDate: "2024-01-17T09:00:00",
        endDate: "2024-01-17T10:00:00",
      }),
    ];

    const group = [
      event({
        id: 10,
        startDate: "2024-01-17T10:00:00",
        endDate: "2024-01-17T11:00:00",
      }),
    ];

    expect(markConflicts(personal, group)[0].hasConflict).toBe(false);
  });

  test("비교할 목록이 비어 있으면 원본을 그대로 반환한다", () => {
    const personal = [event({ id: 1 })];

    expect(markConflicts(personal, [])).toBe(personal);
  });

  test("12시간 이상인 종일형 일정은 충돌 비교에서 제외한다", () => {
    const personal = [
      event({
        id: 1,
        startDate: "2024-01-17T01:00:00",
        endDate: "2024-01-17T23:59:00",
      }),
    ];

    const group = [
      event({
        id: 10,
        startDate: "2024-01-17T13:00:00",
        endDate: "2024-01-17T14:00:00",
      }),
    ];

    const marked = markConflicts(personal, group);

    expect(marked.find((e) => e.id === 1)?.hasConflict).toBe(false);
  });
});
