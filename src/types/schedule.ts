export type EventCategory =
  | "meeting"
  | "work"
  | "personal"
  | "important"
  | "default";

export type Day =
  | "Monday"
  | "Tuesday"
  | "Wednesday"
  | "Thursday"
  | "Friday"
  | "Saturday"
  | "Sunday";

export type ScheduleEvent = {
  id: number;
  title: string;
  startDate: string;
  endDate: string;
  width?: number;
  left?: number;
  category: EventCategory;
  displayStart?: Date;
  displayEnd?: Date;
};

export type holidayType = {
  dateName: string;
  id: number;
  isHoliday: string;
  locdate: string;
};

export interface EventLayout {
  event: ScheduleEvent;
  date: Date;
  top: number;
  height: number;
  width?: number;
  left?: number;
}

export type WeatherData = {
  date: string;
  time: string;

  // 하늘 상태
  SKY: string;

  // 습도
  REH: string;

  // 강수 형태
  PTY: string;

  // 기온
  TMP: string;
};

export type ProcessedWeather = {
  [date: string]: WeatherData;
};

export type ScheduleViewProps = {
  events: ScheduleEvent[];
  holidays: holidayType[];
  weathers: WeatherData[];
};
