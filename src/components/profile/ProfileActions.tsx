import { useRef } from "react";
import { Lock, LogOut, UserMinus } from "lucide-react";
import { motion } from "motion/react";
import { rise } from "@/src/lib/motion";
import {
  MyInfoResponse,
  useLogout,
  usePasswordChange,
  useWithdraw,
} from "@/src/hooks/querys/useMembers";
import { useOverlay } from "@/src/hooks/useOverlay";
import { CustomError, getErrorMessage } from "@/src/types/ErrorResponse";
import { PasswordChangeForm, PasswordFormRef } from "./PasswordFromRef";

export default function ProfileActions({
  auth,
}: {
  auth: MyInfoResponse["provider"];
}) {
  const { mutate: logout } = useLogout();
  const { openModal, openToast, closeModal } = useOverlay();
  const { mutate: passwordChange } = usePasswordChange();
  const { mutate: withdraw } = useWithdraw();

  const formRef = useRef<PasswordFormRef>(null);

  const changePassword = () => {
    openModal({
      title: "비밀번호 변경",
      content: () => <PasswordChangeForm ref={formRef} />,
      mainBtn: "변경",
      subBtn: "취소",
      onFunc: () => {
        formRef.current?.submit((data) => {
          passwordChange(
            {
              currentPassword: data.currentPassword,
              newPassword: data.newPassword,
            },
            {
              onSuccess: () => {
                closeModal();
                logout(); // 바꾼 비밀번호로 다시 로그인하게 즉시 로그아웃
                openToast({
                  message: "비밀번호가 변경됐어요. 다시 로그인해 주세요.",
                });
              },
              onError: (err: CustomError) => {
                const code = err.response?.data?.code;
                // -211 현재 비밀번호 불일치 → 현재 칸, 그 외 형식 오류는 새 비밀번호 칸
                formRef.current?.setServerError(
                  code === -211 ? "currentPassword" : "newPassword",
                  getErrorMessage(err, "비밀번호를 변경하지 못했어요."),
                );
              },
            },
          );
        });
      },
    });
  };

  const confirmWithdraw = () =>
    openModal({
      title: "회원 탈퇴",
      content: () => (
        <div className="flex w-full flex-col gap-2 typo-caption-2 text-secondary">
          <p>탈퇴하면 되돌릴 수 없어요. 아래 내용을 확인해 주세요.</p>
          <ul className="flex list-disc flex-col gap-1 pl-4 text-muted">
            <li>계정과 내 개인 일정이 삭제돼요</li>
            <li>그룹 일정은 그룹에 남고, 작성자 표시만 사라져요</li>
            <li>그룹장인 그룹은 다른 멤버에게 넘어가고, 혼자면 해체돼요</li>
          </ul>
        </div>
      ),
      mainBtn: "탈퇴하기",
      subBtn: "취소",
      onFunc: () => {
        closeModal();
        withdraw(undefined, {
          onSuccess: () => openToast({ message: "탈퇴 처리가 끝났어요." }),
          onError: (err: CustomError) =>
            openToast({ message: getErrorMessage(err, "탈퇴하지 못했어요.") }),
        });
      },
    });

  return (
    <motion.div
      variants={rise}
      initial="hidden"
      animate="show"
      transition={{ ...rise.show.transition, delay: 0.5 }}
      className="flex w-full flex-col gap-3"
    >
      <div className="flex w-full items-center gap-2">
        {auth === "LOCAL" && (
          <button
            type="button"
            onClick={changePassword}
            className="neu-btn btn-spring w-full flex h-10 items-center gap-2 rounded-xl px-4 typo-caption-2 font-medium text-secondary hover:text-foreground"
          >
            <Lock size={14} strokeWidth={1.75} />
            비밀번호 변경
          </button>
        )}

        <button
          type="button"
          onClick={() => logout()}
          className="neu-btn btn-spring flex h-10 w-full items-center gap-2 rounded-xl px-3 typo-caption-2 font-medium text-error-500"
        >
          <LogOut size={14} strokeWidth={1.75} />
          로그아웃
        </button>
      </div>

      {/* 탈퇴는 되돌릴 수 없어 다른 버튼과 섞지 않는다. 대신 찾을 수는 있어야 한다 */}
      <div className="flex w-full justify-center border-t border-divider pt-3">
        <button
          type="button"
          onClick={confirmWithdraw}
          className="flex items-center gap-1.5 rounded-lg px-3 py-2 typo-caption-2 text-muted underline-offset-4 hover:text-error-500 hover:underline"
        >
          <UserMinus size={13} strokeWidth={1.75} />
          회원 탈퇴
        </button>
      </div>
    </motion.div>
  );
}
