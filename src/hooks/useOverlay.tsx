"use client";

import { BlueBtn, LineBtn, WhiteBtn } from "../components/ui/layout/button";
import OverlayContent from "../components/ui/overlay/OverlayContent";
import ModalContent from "../components/ui/overlay/ModalContent";
import ToastContent from "../components/ui/overlay/ToastContent";
import { OverlayProps, useOverlayStore } from "./stores/useOverlayStore";

interface OneButton extends Omit<OverlayProps, "subBtn"> {
  mainBtn?: string;
}

interface TwoButton extends OverlayProps {
  mainBtn: string;
  subBtn: string;
}

interface ToastProps {
  message: string;
}

export function useOverlay() {
  const { modal, alert, confirm, toast, closeOverlay, openOverlay } =
    useOverlayStore();

  const openAlert = (props: OneButton) => openOverlay("alert", props);
  const openModal = (props: TwoButton) => openOverlay("modal", props);
  const openConfirm = (props: TwoButton) => openOverlay("confirm", props);
  const openToast = (props: ToastProps) => {
    openOverlay("toast", props);
    setTimeout(() => {
      closeOverlay("toast");
    }, 2000);
  };
  const alertComponent = (
    <OverlayContent
      title={alert.title}
      message={alert.message}
      message2={alert.message2}
      show={alert.isShow}
      buttons={
        <LineBtn
          onClick={() => closeOverlay("alert", true)}
          className="typo-caption-2 w-full p-3"
          text={alert.mainBtn}
        />
      }
    />
  );

  const confirmComponent = (
    <OverlayContent
      title={confirm.title}
      message={confirm.message}
      message2={confirm.message2}
      message3={confirm.message3}
      show={confirm.isShow}
      buttons={
        <>
          <LineBtn
            onClick={() => closeOverlay("confirm")}
            text={confirm.subBtn}
            className="p-[12px] w-full"
          />
          <BlueBtn
            onClick={() => closeOverlay("confirm", true)}
            text={confirm.mainBtn}
            className="p-[12px] w-full"
          />
        </>
      }
    />
  );

  const modalComponent = (
    <ModalContent
      title={modal.title}
      show={modal.isShow}
      buttons={
        <>
          <WhiteBtn
            onClick={() => closeOverlay("modal")}
            text={modal.subBtn}
            className="w-[100px] p-[12px] w-full"
          />
          <BlueBtn
            onClick={() => closeOverlay("modal", true)}
            text={modal.mainBtn}
            className="w-[100px] p-[12px] w-full"
          />
        </>
      }
    >
      {modal.content}
    </ModalContent>
  );

  const toastComponent = toast.isShow && (
    <ToastContent message={toast.message} />
  );

  return {
    modalComponent,
    alertComponent,
    confirmComponent,
    toastComponent,
    openModal,
    openToast,
    openAlert,
    openConfirm,
    closeAlert: () => closeOverlay("alert"),
    closeConfirm: () => closeOverlay("confirm"),
  };
}
