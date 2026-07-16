import { findHoliday } from "@/src/utils/calendar";
import { holidayType } from "../types/calendar";

export const useIsHoliday = (
  date: Date,
  holidays: holidayType[] | holidayType,
) => {
  return findHoliday(date, holidays);
};
