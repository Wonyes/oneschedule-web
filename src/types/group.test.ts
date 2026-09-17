import { roleOf } from "./group";

describe("roleOf", () => {
  test("SUPER는 owner이자 manager", () => {
    expect(roleOf("SUPER")).toEqual({ owner: true, manager: true });
  });

  test("SUB는 manager지만 owner는 아님", () => {
    expect(roleOf("SUB")).toEqual({ owner: false, manager: true });
  });

  test("MEMBER와 undefined는 둘 다 아님", () => {
    expect(roleOf("MEMBER")).toEqual({ owner: false, manager: false });
    expect(roleOf(undefined)).toEqual({ owner: false, manager: false });
  });
});
