import { countOnline, getPresence } from "./presence";
import { MemberPresence } from "@/src/types/group";

const map = (...items: MemberPresence[]) =>
  new Map(items.map((p) => [p.memberNo, p]));

describe("getPresence", () => {
  it("온라인이면 online=true, 라벨 '온라인'", () => {
    const presence = map({ memberNo: 1, online: true, lastSeenAt: null });
    expect(getPresence(presence, 1)).toEqual({ online: true, label: "온라인" });
  });

  it("오프라인 + lastSeenAt 있으면 상대 시간 라벨", () => {
    const lastSeenAt = new Date(Date.now() - 5 * 60 * 1000).toISOString();
    const presence = map({ memberNo: 1, online: false, lastSeenAt });
    const result = getPresence(presence, 1);
    expect(result.online).toBe(false);
    expect(result.label).toMatch(/5분 전/);
  });

  it("기록이 없으면 '오프라인'", () => {
    expect(getPresence(map(), 1)).toEqual({ online: false, label: "오프라인" });
    expect(getPresence(undefined, 1)).toEqual({
      online: false,
      label: "오프라인",
    });
  });
});

describe("countOnline", () => {
  it("online인 멤버 수만 센다", () => {
    const presence = map(
      { memberNo: 1, online: true, lastSeenAt: null },
      { memberNo: 2, online: false, lastSeenAt: null },
      { memberNo: 3, online: true, lastSeenAt: null },
    );
    expect(countOnline(presence)).toBe(2);
    expect(countOnline(undefined)).toBe(0);
  });
});
