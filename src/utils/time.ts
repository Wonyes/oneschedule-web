import { format, formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";

export const formatTime = (value: string) => {
  const numbers = value.replace(/\D/g, "").slice(0, 4);

  if (!numbers) return "";

  let hour = numbers.slice(0, 2);
  let minute = numbers.slice(2, 4);

  if (Number(hour) > 23) {
    hour = "23";
  }

  if (numbers.length <= 2) {
    return hour;
  }

  if (Number(minute) > 59) {
    minute = "59";
  }

  return `${hour}:${minute}`;
};

export const getTimes = (start: string, end?: string) => {
  const startTime = format(new Date(start), "HH:mm");
  if (!end) return startTime;
  const endTime = format(new Date(end), "HH:mm");
  return `${startTime} - ${endTime}`;
};

export const formatRelativeTime = (date: Date | string) => {
  return formatDistanceToNow(new Date(date), {
    addSuffix: true,
    locale: ko,
  });
};
