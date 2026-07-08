import { useQuery } from "@tanstack/react-query";
import { holidayApi, weatherApi } from "@//lib/api";
import { useCalendarStore } from "../stores/CalendarStore";
import { getBaseDateTime } from "@//utils/timeUtils";
import { ProcessedWeather, WeatherItem } from "@//types/calendar";
import { format } from "date-fns";

export function useHolidays() {
  const currentDate = useCalendarStore((s) => s.currentDate);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth() + 1;

  return useQuery({
    queryKey: ["holidays", year, month],
    queryFn: async () => {
      const { data } = await holidayApi.get("/getRestDeInfo", {
        params: {
          solYear: year,
          solMonth: month.toString().padStart(2, "0"),
          _type: "json",
        },
      });
      return data.response.body.items.item;
    },
  });
}

export function useWeathers(nx: number = 60, ny: number = 127) {
  return useQuery({
    queryKey: ["weathers", nx, ny],
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    placeholderData: (prev) => prev,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    queryFn: async () => {
      const { baseDate, baseTime } = getBaseDateTime();
      const { data } = await weatherApi.get("/getVilageFcst", {
        params: {
          base_date: baseDate,
          base_time: baseTime,
          nx: nx,
          ny: ny,
          numOfRows: 1000,
        },
      });
      return (data.response.body.items.item as WeatherItem[]) || [];
    },
    select: (items: WeatherItem[]) => {
      const currentHourKey = format(new Date(), "HH") + "00";
      return items.reduce((acc, item) => {
        if (item.fcstTime === currentHourKey) {
          if (!acc[item.fcstDate]) {
            acc[item.fcstDate] = { date: item.fcstDate, time: item.fcstTime };
          }
          acc[item.fcstDate][item.category] = item.fcstValue;
        }
        return acc;
      }, {} as ProcessedWeather);
    },
  });
}
