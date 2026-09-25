import { fireEvent, render, screen } from "@testing-library/react";

import CategoryField from "./CategoryField";
import TitleField from "./TitleField";

const renderTitle = (over: Partial<Parameters<typeof TitleField>[0]> = {}) => {
  const onChange = jest.fn();
  render(
    <TitleField
      value=""
      category=""
      error=""
      readOnly={false}
      autoFocus={false}
      onChange={onChange}
      {...over}
    />,
  );
  return onChange;
};

describe("TitleField", () => {
  it("입력하면 값이 그대로 올라간다", () => {
    const onChange = renderTitle();

    fireEvent.change(screen.getByLabelText("제목"), {
      target: { value: "팀 회의" },
    });

    expect(onChange).toHaveBeenCalledWith("팀 회의");
  });

  it("글자 수를 30자 기준으로 보여준다", () => {
    renderTitle({ value: "회의" });

    expect(screen.getByText("2/30")).toBeInTheDocument();
  });

  it("에러가 있으면 메시지를 띄우고 invalid 표시를 단다", () => {
    renderTitle({ error: "제목을 입력해 주세요." });

    expect(screen.getByText("제목을 입력해 주세요.")).toBeInTheDocument();
    expect(screen.getByLabelText("제목")).toHaveAttribute(
      "aria-invalid",
      "true",
    );
  });

  it("읽기 전용이면 수정할 수 없다", () => {
    renderTitle({ value: "고정", readOnly: true });

    expect(screen.getByLabelText("제목")).toHaveAttribute("readonly");
  });
});

describe("CategoryField", () => {
  it("네 가지 카테고리를 모두 보여준다", () => {
    render(<CategoryField value="" readOnly={false} onChange={jest.fn()} />);

    ["업무", "개인", "회의", "중요"].forEach((label) =>
      expect(screen.getByRole("button", { name: label })).toBeInTheDocument(),
    );
  });

  it("선택된 것만 눌린 상태로 표시된다", () => {
    render(
      <CategoryField value="meeting" readOnly={false} onChange={jest.fn()} />,
    );

    expect(screen.getByRole("button", { name: "회의" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(screen.getByRole("button", { name: "업무" })).toHaveAttribute(
      "aria-pressed",
      "false",
    );
  });

  it("누르면 그 카테고리로 바뀐다", () => {
    const onChange = jest.fn();
    render(<CategoryField value="work" readOnly={false} onChange={onChange} />);

    fireEvent.click(screen.getByRole("button", { name: "중요" }));

    expect(onChange).toHaveBeenCalledWith("important");
  });

  it("읽기 전용이면 모든 버튼이 잠긴다", () => {
    render(<CategoryField value="work" readOnly onChange={jest.fn()} />);

    ["업무", "개인", "회의", "중요"].forEach((label) =>
      expect(screen.getByRole("button", { name: label })).toBeDisabled(),
    );
  });
});
