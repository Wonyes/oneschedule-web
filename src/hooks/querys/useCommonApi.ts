import { useQuery } from "@tanstack/react-query";
import { useScheduleStore } from "../stores/useScheduleStore";
import { publicKeys } from "./key/publicKey";
import { useWeatherStore } from "../stores/useWeatherStore";
import { Get } from "./useMutations";
import { holidayType, ProcessedWeather } from "@/src/types/schedule";

/** 기준 달의 공휴일. date를 안 주면 스케줄 페이지가 보고 있는 달을 따른다 */
export function useHolidays(date?: Date) {
  const storeDate = useScheduleStore((s) => s.currentDate);
  const currentDate = date ?? storeDate;

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth() + 1;

  return useQuery({
    queryKey: [publicKeys.holiday, year, month],

    queryFn: () =>
      Get<holidayType[]>({
        url: "/holiday/info",
        params: {
          year: year,
          month: month.toString().padStart(2, "0"),
        },
      }),
  });
}

export function useWeathers() {
  const { nx, ny, name } = useWeatherStore();

  return useQuery({
    queryKey: [publicKeys.weather, nx, ny, name],
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    placeholderData: (prev) => prev,
    refetchOnWindowFocus: false,
    refetchOnMount: false,

    queryFn: () =>
      Get<ProcessedWeather>({
        url: "/weather/info",
        params: {
          nx: nx,
          ny: ny,
        },
      }),
  });
}
