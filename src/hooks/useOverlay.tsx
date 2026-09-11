"use client";

import { AnimatePresence } from "motion/react";
import { Primary, SecondaryBtn } from "../components/ui/layout/button";
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
  onFunc?: () => void;
}

let toastTimer: ReturnType<typeof setTimeout> | null = null;

export function useOverlay() {
  const { modal, alert, confirm, toast, closeOverlay, openOverlay } =
    useOverlayStore();

  const openAlert = (props: OneButton) => openOverlay("alert", props);
  const openModal = (props: TwoButton) => openOverlay("modal", props);
  const openConfirm = (props: TwoButton) => openOverlay("confirm", props);
  const openToast = (props: ToastProps) => {
    if (toastTimer) clearTimeout(toastTimer);

    openOverlay("toast", props);
    toastTimer = setTimeout(() => {
      closeOverlay("toast");
      props.onFunc?.();
      toastTimer = null;
    }, 2000);
  };

  const alertComponent = (
    <OverlayContent
      title={alert.title}
      message={alert.message}
      message2={alert.message2}
      show={alert.isShow}
      layer="alert"
      buttons={
        <Primary
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
      layer="confirm"
      buttons={
        <>
          <SecondaryBtn
            onClick={() => closeOverlay("confirm")}
            text={confirm.subBtn}
            className="p-[12px] w-full"
          />
          <Primary
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
          <SecondaryBtn
            onClick={() => closeOverlay("modal")}
            text={modal.subBtn}
            className="w-[100px] p-[12px] w-full"
          />
          <Primary
            onClick={() => modal.onFunc?.()}
            text={modal.mainBtn}
            className="w-[100px] p-[12px] w-full"
          />
        </>
      }
    >
      {typeof modal.content === "function" ? modal.content() : modal.content}
    </ModalContent>
  );

  const toastComponent = (
    <AnimatePresence>
      {toast.isShow && <ToastContent message={toast.message} />}
    </AnimatePresence>
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
    closeModal: () => closeOverlay("modal"),
    closeAlert: () => closeOverlay("alert"),
    closeConfirm: () => closeOverlay("confirm"),
  };
}
