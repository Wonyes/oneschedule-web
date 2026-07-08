import { format, subDays } from "date-fns";

const getBaseTime = () => {
  const now = new Date();
  const hour = now.getHours();

  const baseTimes = [2, 5, 8, 11, 14, 17, 20, 23];

  let baseHour = 23;
  for (let i = 0; i < baseTimes.length; i++) {
    if (hour < baseTimes[i]) {
      baseHour = baseTimes[i - 1] ?? 23;
      break;
    }
  }

  return baseHour.toString().padStart(2, "0") + "00";
};

const getBaseDateTime = () => {
  const now = new Date();
  const current = now.getHours() * 100 + now.getMinutes();

  const baseTimes = [200, 500, 800, 1100, 1400, 1700, 2000, 2300];

  let baseTimeNum = baseTimes.filter((t) => t <= current).pop();

  let baseDate = format(now, "yyyyMMdd");

  if (!baseTimeNum || current < 200) {
    baseDate = format(subDays(now, 1), "yyyyMMdd");
    baseTimeNum = 2300;
  }

  return {
    baseDate,
    baseTime: String(baseTimeNum).padStart(4, "0"),
  };
};

export { getBaseTime, getBaseDateTime };
