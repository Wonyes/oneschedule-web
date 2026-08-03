import { findHoliday } from "@/src/utils/schedule";
import { holidayType } from "../types/schedule";

export const useIsHoliday = (
  date: Date,
  holidays: holidayType[] | holidayType,
) => {
  return findHoliday(date, holidays);
};
