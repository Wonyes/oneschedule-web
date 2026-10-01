import { render, screen } from "@testing-library/react";

import { EmailVerifyFields } from "./AuthFields";
import { EmailStatus } from "./useEmailVerification";

const renderFields = (
  over: Partial<Parameters<typeof EmailVerifyFields>[0]> = {},
) =>
  render(
    <EmailVerifyFields
      email="a@b.com"
      code=""
      status={"idle" as EmailStatus}
      codeSeconds={180}
      resendSeconds={0}
      onChange={jest.fn()}
      onResend={jest.fn()}
      {...over}
    />,
  );

describe("EmailVerifyFields", () => {
  it("코드를 보내기 전에는 인증 코드 칸이 없다", () => {
    renderFields();

    expect(screen.getByLabelText("이메일")).toBeInTheDocument();
    expect(screen.queryByLabelText("인증 코드")).not.toBeInTheDocument();
  });

  it("코드를 보내면 인증 코드 칸과 남은 시간이 나온다", () => {
    renderFields({ status: "sent", codeSeconds: 125 });

    expect(screen.getByLabelText("인증 코드")).toBeInTheDocument();
    expect(screen.getByText(/남은 시간/)).toBeInTheDocument();
  });

  it("남은 시간이 0이면 만료 안내로 바뀐다", () => {
    renderFields({ status: "sent", codeSeconds: 0 });

    expect(screen.getByText(/만료됐어요/)).toBeInTheDocument();
    expect(screen.queryByText(/남은 시간/)).not.toBeInTheDocument();
  });

  it("재전송 쿨다운 중에는 버튼이 잠기고 남은 초를 보여준다", () => {
    renderFields({ status: "sent", resendSeconds: 42 });

    const button = screen.getByRole("button", { name: /42초 후/ });

    expect(button).toBeDisabled();
  });

  it("쿨다운이 끝나면 다시 받기를 누를 수 있다", () => {
    renderFields({ status: "sent", resendSeconds: 0 });

    expect(screen.getByRole("button", { name: "다시 받기" })).toBeEnabled();
  });

  it("인증이 끝나면 완료 메시지가 보인다", () => {
    renderFields({ status: "verified" });

    expect(screen.getByText("인증이 완료됐어요.")).toBeInTheDocument();
  });
});
