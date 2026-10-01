import { addDays, format, setHours, setMinutes, startOfDay } from "date-fns";

import { ScheduleEvent } from "@/src/types/schedule";

const at = (base: Date, dayOffset: number, hour: number, minute = 0) =>
  format(
    setMinutes(setHours(addDays(startOfDay(base), dayOffset), hour), minute),
    "yyyy-MM-dd'T'HH:mm:ss",
  );

const AUTHORS = [
  { memberNo: 1, nickname: "지민" },
  { memberNo: 2, nickname: "현우" },
  { memberNo: 3, nickname: "서연" },
];

/**
 * 비로그인 홈 미리보기용 가짜 일정. 오늘을 기준으로 만들어 달력이 늘 채워져 보인다.
 * 개인·그룹 일정이 섞여 있고, 하나는 여러 날에 걸친다.
 */
export function demoEvents(today: Date): ScheduleEvent[] {
  const e = (
    id: number,
    title: string,
    day: number,
    start: [number, number?],
    end: [number, number?],
    category: ScheduleEvent["category"],
    author = AUTHORS[0],
    endDay = day,
  ): ScheduleEvent => ({
    id,
    title,
    startDate: at(today, day, start[0], start[1]),
    endDate: at(today, endDay, end[0], end[1]),
    category,
    createdAt: at(today, -7, 9),
    author,
  });

  return [
    e(1, "팀 스탠드업", 0, [10], [10, 30], "meeting", AUTHORS[1]),
    e(2, "치과", 0, [15], [16], "personal"),
    e(3, "디자인 리뷰", 1, [14], [15, 30], "work", AUTHORS[2]),
    e(4, "헬스", 2, [7], [8], "personal"),
    e(5, "배포 점검", 2, [11], [12], "important", AUTHORS[1]),
    e(6, "부모님 생신", 3, [18], [21], "personal"),
    e(7, "워크숍", 5, [9], [18], "work", AUTHORS[2], 6),
    e(8, "스프린트 회고", 8, [16], [17], "meeting", AUTHORS[1]),
    e(9, "친구 결혼식", 9, [12], [14], "personal"),
    e(10, "월간 보고", 12, [10], [11], "important", AUTHORS[2]),
    e(11, "북클럽", -3, [19], [20, 30], "personal"),
    e(12, "고객 미팅", -5, [13], [14], "meeting", AUTHORS[1]),
  ];
}
