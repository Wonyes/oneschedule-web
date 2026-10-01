"use client";

import { useOverlay } from "@/src/hooks/useOverlay";

export default function GlobalOverlays() {
  const { alertComponent, confirmComponent, modalComponent, toastComponent } =
    useOverlay();

  return (
    <>
      {alertComponent}
      {modalComponent}
      {toastComponent}
      {confirmComponent}
    </>
  );
}
