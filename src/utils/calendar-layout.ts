import { CalendarEvent } from "@/types/calendar";
import { endOfDay, isWithinInterval, startOfDay } from "date-fns";
import { getEventPosition } from "./calendar";

export function getDayLayouts(events: CalendarEvent[], currentDate: Date) {
  return events
    .filter((event) => {
      const start = new Date(event.startDate);
      const end = new Date(event.endDate);

      return isWithinInterval(currentDate, {
        start: startOfDay(start),
        end: endOfDay(end),
      });
    })
    .map((event) => {
      const start = new Date(event.startDate);
      const end = new Date(event.endDate);

      // DayView에서는 해당 날짜 시간만 표시
      const displayStart = new Date(currentDate);
      displayStart.setHours(start.getHours(), start.getMinutes(), 0, 0);

      const displayEnd = new Date(currentDate);
      displayEnd.setHours(end.getHours(), end.getMinutes(), 0, 0);

      const { top, height } = getEventPosition(
        displayStart,
        displayEnd,
        currentDate,
      );

      return {
        event,
        top,
        height,
        left: "0%",
        width: "100%",
      };
    });
}
