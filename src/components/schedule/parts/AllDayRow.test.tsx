import { fireEvent, render, screen } from "@testing-library/react";

import { ScheduleEvent } from "@/src/types/schedule";
import AllDayRow from "./AllDayRow";

const event = (over: Partial<ScheduleEvent> = {}): ScheduleEvent => ({
  id: 1,
  title: "워크숍",
  startDate: "2026-09-21T00:00:00",
  endDate: "2026-09-23T00:00:00",
  category: "work",
  author: { memberNo: 1, nickname: "wony" },
  createdAt: "2026-09-20T00:00:00",
  ...over,
});

/** 주뷰 기준 월~일 */
const week = Array.from({ length: 7 }, (_, i) => new Date(2026, 8, 21 + i));

const renderRow = (events: ScheduleEvent[], onClick = jest.fn()) => {
  const view = render(
    <AllDayRow dates={week} events={events} gutter="60px" onClick={onClick} />,
  );
  return { ...view, onClick };
};

describe("AllDayRow", () => {
  it("일정이 없으면 아무것도 그리지 않는다", () => {
    const { container } = renderRow([]);

    expect(container).toBeEmptyDOMElement();
  });

  it("다일 일정이 있으면 '종일' 줄이 나온다", () => {
    renderRow([event()]);

    expect(screen.getByText("종일")).toBeInTheDocument();
    expect(screen.getAllByText("워크숍").length).toBeGreaterThan(0);
  });

  it("걸쳐 있는 날짜 수만큼 막대가 이어진다 (21~23일 = 3칸)", () => {
    renderRow([event()]);

    expect(screen.getAllByText("워크숍")).toHaveLength(3);
  });

  it("막대를 누르면 그 일정으로 콜백이 온다", () => {
    const { onClick } = renderRow([event({ title: "회식" })]);

    fireEvent.click(screen.getAllByText("회식")[0]);

    expect(onClick).toHaveBeenCalledTimes(1);
    expect(onClick.mock.calls[0][0]).toMatchObject({ id: 1, title: "회식" });
  });

  it("겹치는 다일 일정은 서로 다른 레인에 쌓인다", () => {
    renderRow([
      event(),
      event({
        id: 2,
        title: "출장",
        startDate: "2026-09-22T00:00:00",
        endDate: "2026-09-24T00:00:00",
      }),
    ]);

    expect(screen.getAllByText("워크숍").length).toBeGreaterThan(0);
    expect(screen.getAllByText("출장").length).toBeGreaterThan(0);
  });
});
