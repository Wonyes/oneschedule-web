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

export type CalendarEvent = {
  id: number;
  title: string;
  startDate: string;
  endDate: string;
  category: EventCategory;
  displayStart?: string;
  displayEnd?: string;
};

export type holidayType = {
  dateKind: string;
  dateName: string;
  isHoliday: string;
  locdate: string;
  seq: number;
};

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
