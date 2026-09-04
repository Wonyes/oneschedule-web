import { act, renderHook } from "@testing-library/react";
import { useForm } from "./useForm";

describe("useForm", () => {
  test("초기값으로 form을 채운다", () => {
    const { result } = renderHook(() => useForm({ nickname: "wony" }));
    expect(result.current.form.nickname).toBe("wony");
  });

  test("initialValue 없이 호출해도 빈 객체로 시작한다", () => {
    const { result } = renderHook(() => useForm<{ a?: string }>());
    expect(result.current.form).toEqual({});
  });

  test("formChange는 해당 필드만 갱신하고 그 필드의 에러/성공 메시지를 지운다", () => {
    const { result } = renderHook(() =>
      useForm({ nickname: "", phone: "" }),
    );

    act(() => {
      result.current.setErrors({ nickname: "중복된 닉네임입니다." });
      result.current.setSuccess({ phone: "확인되었습니다." });
    });

    act(() => {
      result.current.formChange({
        target: { name: "nickname", value: "새닉네임" },
      } as React.ChangeEvent<HTMLInputElement>);
    });

    expect(result.current.form).toEqual({
      nickname: "새닉네임",
      phone: "",
    });
    expect(result.current.errors.nickname).toBe("");
    expect(result.current.success.phone).toBe("확인되었습니다.");
  });

  test("resetForm은 form을 통째로 바꾸고 에러를 전부 지운다", () => {
    const { result } = renderHook(() => useForm({ nickname: "" }));

    act(() => {
      result.current.setErrors({ nickname: "에러" });
    });

    act(() => {
      result.current.resetForm({ nickname: "리셋됨" });
    });

    expect(result.current.form).toEqual({ nickname: "리셋됨" });
    expect(result.current.errors).toEqual({});
  });

  test("clearError는 해당 필드의 에러만 지운다", () => {
    const { result } = renderHook(() =>
      useForm({ a: "", b: "" }),
    );

    act(() => {
      result.current.setErrors({ a: "에러A", b: "에러B" });
    });

    act(() => {
      result.current.clearError("a");
    });

    expect(result.current.errors.a).toBe("");
    expect(result.current.errors.b).toBe("에러B");
  });
});
