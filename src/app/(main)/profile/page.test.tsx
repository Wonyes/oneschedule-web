import { render, screen, fireEvent } from "@testing-library/react";

import {
  useMyInfo,
  useLogout,
  useMyinfoChange,
  useNicknameCheck,
  usePasswordChange,
  useProfileImageUpload,
  MyInfoResponse,
} from "@/src/hooks/querys/useMembers";

import ProfilePage from "./page";
import { UseQueryResult } from "@tanstack/react-query";

jest.mock("@/src/hooks/querys/useMembers");

const mockUseMyInfo = useMyInfo as jest.MockedFunction<typeof useMyInfo>;

const mockUseLogout = useLogout as jest.Mock;
const mockUseMyinfoChange = useMyinfoChange as jest.Mock;
const mockUseNicknameCheck = useNicknameCheck as jest.Mock;
const mockUsePasswordChange = usePasswordChange as jest.Mock;
const mockUseProfileImageUpload = useProfileImageUpload as jest.Mock;

describe("ProfilePage", () => {
  beforeEach(() => {
    mockUseMyInfo.mockReturnValue({
      data: {
        nickname: "tester",
        name: "홍길동",
        phoneNumber: "01012345678",
        email: "test@test.com",
        groupCode: null,
      },
      error: null,
      isError: false,
      isSuccess: true,
      isLoading: false,
      isPending: false,
      status: "success",
    } as UseQueryResult<MyInfoResponse, Error>);

    mockUseLogout.mockReturnValue({
      mutate: jest.fn(),
    });

    mockUseMyinfoChange.mockReturnValue({
      mutate: jest.fn(),
    });

    mockUseNicknameCheck.mockReturnValue({
      refetch: jest.fn(),
    });

    mockUsePasswordChange.mockReturnValue({
      mutate: jest.fn(),
    });

    mockUseProfileImageUpload.mockReturnValue({
      mutate: jest.fn(),
      isPending: false,
    });
  });

  test("닉네임 중복 확인 없이 저장하면 에러 메시지가 표시된다", () => {
    render(<ProfilePage />);

    const editButtons = screen.getAllByText("수정");

    fireEvent.click(editButtons[0]);

    const saveButton = screen.getByText("완료");

    fireEvent.click(saveButton);

    expect(
      screen.getByText("닉네임 중복 확인을 해주세요."),
    ).toBeInTheDocument();

    expect(screen.getByDisplayValue("tester")).toBeInTheDocument();
  });
});
