import { notificationIcon } from "./notificationIcons";

describe("notificationIcon", () => {
  test("아는 타입은 고유 아이콘·색", () => {
    const welcome = notificationIcon("WELCOME");
    const rejected = notificationIcon("GROUP_JOIN_REJECTED");
    expect(welcome.tone).toContain("accent");
    expect(rejected.tone).toContain("muted");
    expect(welcome.icon).not.toEqual(rejected.icon);
  });

  test("모르는 타입은 종 아이콘으로 폴백", () => {
    const unknown = notificationIcon("SOMETHING_NEW");
    expect(unknown.tone).toBe("bg-accent/10 text-accent");
  });
});
