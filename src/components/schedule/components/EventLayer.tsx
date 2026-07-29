import ScheduleCard from "./ScheduleCard";
import { ScheduleEvent } from "@/src/types/schedule";

type EventLayout = {
  key: string;
  event: ScheduleEvent;
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
        <ScheduleCard
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
