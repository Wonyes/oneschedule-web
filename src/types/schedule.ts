export type EventCategory =
  "meeting" | "work" | "personal" | "important" | "default";

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
  content?: string;
  participantMemberNos?: number[];
  displayStart?: Date;
  displayEnd?: Date;
  hasConflict?: boolean;
  author: {
    memberNo: number;
    nickname: string;
  };
  createdAt: string;
  createdBy?: number;
};

export type ScheduleViewType = "PERSONAL" | "GROUP";

export type ScheduleApiRequest = {
  title: string;
  category: string;
  content?: string;
  startDate: string;
  endDate?: string;
  startTime?: string;
  endTime?: string;
  participantMemberNos?: number[];
};

export type ScheduleParticipant = {
  memberNo: number;
  nickname: string;
};

export type ScheduleApiResponse = {
  id: number;
  title: string;
  content: string;
  category: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  createdAt: string;
  author: {
    memberNo: number;
    nickname: string;
  };
  participants: ScheduleParticipant[];
  type?: ScheduleViewType;
  createdBy?: number;
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
  isOverflow?: boolean;
  overflowCount?: number;
}

export type WeatherData = {
  date: string;
  time: string;

  SKY: string;

  REH: string;

  PTY: string;

  TMP: string;
};

export type ProcessedWeather = {
  [date: string]: WeatherData;
};

export type ScheduleViewProps = {
  events: ScheduleEvent[];
  holidays: holidayType[];
  weathers: ProcessedWeather;
  isWeatherLoading?: boolean;
};
