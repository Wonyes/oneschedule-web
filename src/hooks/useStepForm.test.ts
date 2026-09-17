import { act, renderHook } from "@testing-library/react";
import { useStepForm } from "./useStepForm";

describe("useStepForm", () => {
  test("next/back은 0..total-1 안에서만 움직이고 direction을 남긴다", () => {
    const { result } = renderHook(() => useStepForm<"a" | "b">(3));

    expect(result.current.step).toBe(0);
    expect(result.current.isLast).toBe(false);

    act(() => result.current.next());
    act(() => result.current.next());
    expect(result.current.step).toBe(2);
    expect(result.current.isLast).toBe(true);
    expect(result.current.direction).toBe(1);

    act(() => result.current.next()); // 끝에서 더 못 감
    expect(result.current.step).toBe(2);

    act(() => result.current.back());
    expect(result.current.step).toBe(1);
    expect(result.current.direction).toBe(-1);

    act(() => result.current.back());
    act(() => result.current.back()); // 0 아래로 안 감
    expect(result.current.step).toBe(0);
  });

  test("fail은 에러를 기록하고 false를 돌려주며, clearError는 그 필드만 지운다", () => {
    const { result } = renderHook(() => useStepForm<"a" | "b">(2));

    let returned: boolean | undefined;
    act(() => {
      returned = result.current.fail("a", "에러A");
      result.current.fail("b", "에러B");
    });
    expect(returned).toBe(false);
    expect(result.current.errors).toEqual({ a: "에러A", b: "에러B" });

    act(() => result.current.clearError("a"));
    expect(result.current.errors.a).toBeUndefined();
    expect(result.current.errors.b).toBe("에러B");
  });
});
