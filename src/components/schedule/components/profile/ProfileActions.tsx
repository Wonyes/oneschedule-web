import { useRef } from "react";
import { Lock, LogOut } from "lucide-react";
import BaseCard from "@/src/components/ui/card/BaseCard";
import { ActionRow } from "@/src/components/ui/layout/flex";
import {
  MyInfoResponse,
  useLogout,
  usePasswordChange,
} from "@/src/hooks/querys/useMembers";
import { useOverlay } from "@/src/hooks/useOverlay";
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
                openToast({
                  message: "비밀번호가 변경되었습니다.",
                  onFunc: () => logout(),
                });
                closeModal();
              },
            },
          );
        });
      },
    });
  };

  return (
    <div className="flex w-full flex-col gap-3">
      {auth === "LOCAL" && (
        <BaseCard className="overflow-hidden" glow>
          <ActionRow
            onClick={changePassword}
            icon={<Lock size={18} />}
            title="비밀번호 변경"
          />
        </BaseCard>
      )}

      <BaseCard className="overflow-hidden">
        <ActionRow
          icon={<LogOut size={18} />}
          title="로그아웃"
          danger
          onClick={() => logout()}
        />
      </BaseCard>
    </div>
  );
}
