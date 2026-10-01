import { fireEvent, render, screen } from "@testing-library/react";

import ConsentFields, { Consent } from "./ConsentFields";

const NONE: Consent = { terms: false, privacy: false };
const ALL: Consent = { terms: true, privacy: true };

const renderFields = (value: Consent, onChange = jest.fn()) => {
  render(<ConsentFields value={value} onChange={onChange} />);
  return onChange;
};

describe("ConsentFields", () => {
  it("전체 동의를 누르면 두 항목이 한꺼번에 켜진다", () => {
    const onChange = renderFields(NONE);

    fireEvent.click(screen.getByRole("checkbox", { name: /전체 동의/ }));

    expect(onChange).toHaveBeenCalledWith(ALL);
  });

  it("다 켜진 상태에서 전체 동의를 누르면 한꺼번에 꺼진다", () => {
    const onChange = renderFields(ALL);

    fireEvent.click(screen.getByRole("checkbox", { name: /전체 동의/ }));

    expect(onChange).toHaveBeenCalledWith(NONE);
  });

  it("개별 항목은 자기 값만 뒤집는다", () => {
    const onChange = renderFields(NONE);

    fireEvent.click(screen.getByRole("checkbox", { name: /이용약관/ }));

    expect(onChange).toHaveBeenCalledWith({ terms: true, privacy: false });
  });

  it("둘 다 켜져야 전체 동의가 체크로 보인다", () => {
    const { rerender } = render(
      <ConsentFields
        value={{ terms: true, privacy: false }}
        onChange={jest.fn()}
      />,
    );

    expect(screen.getByRole("checkbox", { name: /전체 동의/ })).toHaveAttribute(
      "aria-checked",
      "false",
    );

    rerender(<ConsentFields value={ALL} onChange={jest.fn()} />);

    expect(screen.getByRole("checkbox", { name: /전체 동의/ })).toHaveAttribute(
      "aria-checked",
      "true",
    );
  });

  it("에러 메시지는 있을 때만 보인다", () => {
    const { rerender } = render(
      <ConsentFields value={NONE} onChange={jest.fn()} />,
    );
    expect(screen.queryByText("동의가 필요해요.")).not.toBeInTheDocument();

    rerender(
      <ConsentFields
        value={NONE}
        error="동의가 필요해요."
        onChange={jest.fn()}
      />,
    );
    expect(screen.getByText("동의가 필요해요.")).toBeInTheDocument();
  });

  it("약관 링크는 새 탭으로 열어 입력 중인 폼을 지키다", () => {
    renderFields(NONE);

    const links = screen.getAllByRole("link", { name: "보기" });

    expect(links).toHaveLength(2);
    links.forEach((link) => expect(link).toHaveAttribute("target", "_blank"));
    expect(links[0]).toHaveAttribute("href", "/terms");
    expect(links[1]).toHaveAttribute("href", "/privacy");
  });
});
