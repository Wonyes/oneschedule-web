import { useQuery } from "@tanstack/react-query";
import { useCalendarStore } from "../stores/CalendarStore";
import api from "@/src/lib/api";
import { publicKeys } from "./key/publicKey";
import { useWeatherStore } from "../stores/WeatherStore";

export function useHolidays() {
  const currentDate = useCalendarStore((s) => s.currentDate);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth() + 1;

  return useQuery({
    queryKey: [publicKeys.holiday, year, month],

    queryFn: async () => {
      const { data } = await api.get("/holiday/info", {
        params: {
          year: year,
          month: month.toString().padStart(2, "0"),
        },
      });
      return data.result || [];
    },
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
    queryFn: async () => {
      const { data } = await api.get("/weather/info", {
        params: {
          nx: nx,
          ny: ny,
        },
      });
      return data.result;
    },
  });
}
