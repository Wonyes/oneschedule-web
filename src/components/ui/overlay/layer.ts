/**
 * 오버레이 쌓임 순서.
 *
 * 전에는 모달·알럿·컨펌이 전부 z-[9999]라 DOM 순서로 승패가 갈렸다.
 * GlobalOverlays가 알럿을 모달보다 먼저 그려서, 모달 위에 뜬 알럿이
 * 모달 뒤로 숨는 문제가 있었다.
 *
 * 나중에 뜨는 것이 위로 와야 한다. 알럿·컨펌은 대개 모달에 대한 응답이므로
 * 모달보다 위, 토스트는 무엇 위에서든 보여야 하므로 맨 위다.
 */
export const OVERLAY_LAYER = {
  modal: { backdrop: "z-[9990]", box: "z-[9991]" },
  confirm: { backdrop: "z-[9992]", box: "z-[9993]" },
  alert: { backdrop: "z-[9994]", box: "z-[9995]" },
} as const;

export type OverlayLayer = keyof typeof OVERLAY_LAYER;
