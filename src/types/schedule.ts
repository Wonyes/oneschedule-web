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
  dateKind: string;
  dateName: string;
  isHoliday: string;
  locdate: string;
  seq: number;
};

export interface EventLayout {
  event: ScheduleEvent;
  date: Date;
  top: number;
  height: number;
  width?: number;
  left?: number;
}

export interface WeatherItem {
  baseDate: string;
  baseTime: string;
  category: string;
  fcstDate: string;
  fcstTime: string;
  fcstValue: string;
  nx: number;
  ny: number;
}

export interface WeatherData {
  date: string;
  time: string;
  [key: string]: string;
}

export interface ProcessedWeather {
  [key: string]: WeatherData;
}

export type ScheduleViewProps = {
  events: ScheduleEvent[];
  holidays: holidayType[];
  weathers: ProcessedWeather | undefined;
};
