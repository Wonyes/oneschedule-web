export const formatTime = (value: string) => {
  let numbers = value.replace(/\D/g, "");

  if (!numbers) return "";

  numbers = numbers.slice(0, 4);

  let hour = numbers.slice(0, 2);
  let minute = numbers.slice(2, 4);

  if (Number(hour) > 23) {
    hour = "23";
  }

  if (!minute) {
    minute = "00";
  }

  if (Number(minute) > 59) {
    minute = "59";
  }

  return `${hour}:${minute}`;
};
