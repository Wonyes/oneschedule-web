import { findHoliday } from "@/src/utils/Schedule";
import { holidayType } from "../types/Schedule";

export const useIsHoliday = (
  date: Date,
  holidays: holidayType[] | holidayType,
) => {
  return findHoliday(date, holidays);
};
