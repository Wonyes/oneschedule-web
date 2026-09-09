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
  startDate: string; // yyyy-MM-dd
  endDate?: string; // yyyy-MM-dd
  startTime?: string; // HH:mm:ss
  endTime?: string; // HH:mm:ss
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
  /** 개인/그룹 구분. 서버가 내려주는 값이다. */
  type?: ScheduleViewType;
  /** 작성자 memberNo. 서버는 author.memberNo로 내려주므로 보통 비어 있다. */
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
  weathers: ProcessedWeather;
  isWeatherLoading?: boolean;
};
