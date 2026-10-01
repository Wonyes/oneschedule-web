import {
  ACTIVE_GROUP_COOKIE,
  groupPath,
  groupSlug,
  parseGroupNo,
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

describe("groupSlug / groupPath (URL 조각)", () => {
  test("공백은 하이픈으로, 대문자는 소문자로", () => {
    expect(groupSlug("Wony House")).toBe("wony-house");
  });

  test("한글은 URL에서 %로 깨져 보이므로 버린다", () => {
    expect(groupSlug("운동 모임")).toBe("");
    expect(groupPath({ groupNo: 45, groupName: "공개그룹" })).toBe("/group/45");
  });

  test("기호는 버리고 영문·숫자만 남긴다", () => {
    expect(groupSlug("팀! (2026)")).toBe("2026");
    expect(groupSlug("wony  house!!")).toBe("wony-house");
  });

  test("번호 뒤에 이름을 붙인다", () => {
    expect(groupPath({ groupNo: 45, groupName: "Wony House" })).toBe(
      "/group/45-wony-house",
    );
  });

  test("이름이 기호뿐이면 번호만 남긴다", () => {
    expect(groupPath({ groupNo: 45, groupName: "!!!" })).toBe("/group/45");
  });
});

describe("parseGroupNo (URL 조각 → 번호)", () => {
  test("번호-이름에서 번호를 꺼낸다", () => {
    expect(parseGroupNo("45-wony-house")).toBe(45);
  });

  test("번호만 있어도 된다", () => {
    expect(parseGroupNo("45")).toBe(45);
  });

  test("이름이 바뀌어 슬러그가 달라도 번호로 찾는다", () => {
    expect(parseGroupNo("45-old-name")).toBe(45);
  });

  test("인코딩된 한글도 처리한다", () => {
    expect(parseGroupNo("12-%EC%9A%B4%EB%8F%99")).toBe(12);
  });

  test("번호로 시작하지 않으면 null", () => {
    expect(parseGroupNo("wony-house")).toBeNull();
    expect(parseGroupNo("")).toBeNull();
  });
});
