export const formatTime = (value: string) => {
  const numbers = value.replace(/\D/g, "").slice(0, 4);

  if (!numbers) return "";

  let hour = numbers.slice(0, 2);
  let minute = numbers.slice(2, 4);

  // 시간 검증 (23시 초과 시 23으로 고정)
  if (Number(hour) > 23) {
    hour = "23";
  }

  // 시간이 아직 1~2자리일 때는 콜론(:) 없이 시간만 반환 (타이핑 끊김 방지)
  if (numbers.length <= 2) {
    return hour;
  }

  // 분 검증 (59분 초과 시 59로 고정)
  if (Number(minute) > 59) {
    minute = "59";
  }

  return `${hour}:${minute}`;
};
