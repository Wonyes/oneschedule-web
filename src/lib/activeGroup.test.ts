import {
  ACTIVE_GROUP_COOKIE,
  parseActiveGroupNo,
  readActiveGroupNo,
  resolveActiveGroup,
  writeActiveGroupNo,
} from "./activeGroup";
import { MyGroupResponse } from "@/src/types/group";

const group = (
  overrides: Partial<MyGroupResponse> & { groupNo: number },
): MyGroupResponse => ({
  groupName: "그룹",
  groupCode: "CODE",
  groupRole: "MEMBER",
  position: "멤버",
  visibility: "PRIVATE",
  description: null,
  members: [],
  ...overrides,
});

describe("parseActiveGroupNo", () => {
  test("null/undefined이면 null", () => {
    expect(parseActiveGroupNo(null)).toBeNull();
    expect(parseActiveGroupNo(undefined)).toBeNull();
  });

  test("빈 문자열이면 null", () => {
    expect(parseActiveGroupNo("")).toBeNull();
  });

  test("정수 문자열이면 숫자로 변환한다", () => {
    expect(parseActiveGroupNo("42")).toBe(42);
  });

  test("정수가 아닌 값이면 null", () => {
    expect(parseActiveGroupNo("abc")).toBeNull();
    expect(parseActiveGroupNo("1.5")).toBeNull();
  });
});

describe("resolveActiveGroup", () => {
  test("그룹이 없으면 undefined", () => {
    expect(resolveActiveGroup([], 1)).toBeUndefined();
  });

  test("activeGroupNo와 일치하는 그룹을 찾는다", () => {
    const groups = [group({ groupNo: 1 }), group({ groupNo: 2 })];
    expect(resolveActiveGroup(groups, 2)?.groupNo).toBe(2);
  });

  test("activeGroupNo가 목록에 없으면(탈퇴·해체) 첫 번째 그룹으로 대체한다", () => {
    const groups = [group({ groupNo: 1 }), group({ groupNo: 2 })];
    expect(resolveActiveGroup(groups, 999)?.groupNo).toBe(1);
  });

  test("activeGroupNo가 null이면 첫 번째 그룹", () => {
    const groups = [group({ groupNo: 5 })];
    expect(resolveActiveGroup(groups, null)?.groupNo).toBe(5);
  });
});

describe("readActiveGroupNo / writeActiveGroupNo (쿠키)", () => {
  beforeEach(() => {
    document.cookie = `${ACTIVE_GROUP_COOKIE}=; path=/; max-age=0`;
  });

  test("쿠키가 없으면 null", () => {
    expect(readActiveGroupNo()).toBeNull();
  });

  test("쓴 값을 그대로 읽는다", () => {
    writeActiveGroupNo(7);
    expect(readActiveGroupNo()).toBe(7);
  });
});
