export const OVERLAY_LAYER = {
  modal: { backdrop: "z-[9990]", box: "z-[9991]" },
  confirm: { backdrop: "z-[9992]", box: "z-[9993]" },
  alert: { backdrop: "z-[9994]", box: "z-[9995]" },
} as const;

export type OverlayLayer = keyof typeof OVERLAY_LAYER;
