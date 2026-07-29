"use client";

import { useOverlay } from "@/src/hooks/useOverlay";
import Sheet from "./sheet/sheet";

export default function GlobalOverlays() {
  const { alertComponent, confirmComponent, modalComponent, toastComponent } =
    useOverlay();

  return (
    <>
      <Sheet />
      {alertComponent}
      {modalComponent}
      {toastComponent}
      {confirmComponent}
    </>
  );
}
