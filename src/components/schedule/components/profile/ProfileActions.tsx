import { useRef } from "react";
import { Lock, LogOut } from "lucide-react";
import { motion } from "motion/react";
import { rise } from "@/src/lib/motion";
import {
  MyInfoResponse,
  useLogout,
  usePasswordChange,
} from "@/src/hooks/querys/useMembers";
import { useOverlay } from "@/src/hooks/useOverlay";
import { CustomError, getErrorMessage } from "@/src/types/ErrorResponse";
import {
  PasswordChangeForm,
  PasswordFormRef,
} from "../../layout/modal/PasswordFromRef";

export default function ProfileActions({
  auth,
}: {
  auth: MyInfoResponse["provider"];
}) {
  const { mutate: logout } = useLogout();
  const { openModal, openToast, closeModal } = useOverlay();
  const { mutate: passwordChange } = usePasswordChange();

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

  return (
    <motion.div
      variants={rise}
      initial="hidden"
      animate="show"
      transition={{ ...rise.show.transition, delay: 0.5 }}
      className="flex w-full items-center gap-2"
    >
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
    </motion.div>
  );
}
