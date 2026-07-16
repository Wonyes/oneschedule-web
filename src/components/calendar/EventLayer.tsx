import CalendarCard from "../common/CalendarCard";
import { CalendarEvent } from "@/src/types/calendar";

type EventLayout = {
  key: string;
  event: CalendarEvent;
  date: Date;
  top: number;
  height: number;
  className?: string;
  width?: number;
  left?: number;
};

type EventLayerProps = {
  events: EventLayout[];
};

export default function EventLayer({ events }: EventLayerProps) {
  return (
    <>
      {events.map((item) => (
        <CalendarCard
          key={item.key}
          event={item.event}
          date={item.date}
          top={item.top}
          height={item.height}
          className={item.className}
        />
      ))}
    </>
  );
}
