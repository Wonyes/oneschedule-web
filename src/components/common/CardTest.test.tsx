import { render, screen } from "@testing-library/react";
import { expect } from "vitest";
import WeekView from "../calendar/WeekView";

const mockEvents = [
  {
    id: 100,
    title: "테스트 일정",
    startDate: "...",
    endDate: "...",
    category: "meeting",
  },
];

render(<WeekView events={mockEvents} holidays={[]} weathers={undefined} />);

expect(screen.getByText("테스트 일정")).toBeInTheDocument();
