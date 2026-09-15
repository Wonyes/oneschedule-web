import { ImageResponse } from "next/og";

export const alt = "ONE SCHEDULE — 팀의 일정을 한눈에";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const BG = "#111320";
const SURFACE = "#1a1d2b";
const ACCENT = "#7c6cf5";
const ACCENT_SOFT = "#9d92f8";
const MUTED = "#8b8fa3";

// Pretendard 두 굵기 (satori는 woff까지 지원)
const PRETENDARD_BOLD =
  "https://cdn.jsdelivr.net/npm/pretendard@1.3.9/dist/web/static/woff/Pretendard-Bold.woff";
const PRETENDARD =
  "https://cdn.jsdelivr.net/npm/pretendard@1.3.9/dist/web/static/woff/Pretendard-Medium.woff";

/** 원판 중심(cx, cy) 기준 각도·반지름 위치의 뉴모피즘 타일 */
function Satellite({
  cx,
  cy,
  angle,
  radius,
  size: s,
  children,
}: {
  cx: number;
  cy: number;
  angle: number;
  radius: number;
  size: number;
  children: React.ReactNode;
}) {
  const rad = (angle * Math.PI) / 180;
  return (
    <div
      style={{
        position: "absolute",
        left: cx + Math.cos(rad) * radius - s / 2,
        top: cy + Math.sin(rad) * radius - s / 2,
        width: s,
        height: s,
        borderRadius: s * 0.3,
        background: SURFACE,
        boxShadow:
          "10px 10px 22px rgba(0,0,0,0.6), -6px -6px 16px rgba(255,255,255,0.045), inset 0 0 0 1px rgba(255,255,255,0.04)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {children}
    </div>
  );
}

function Glyph({ kind }: { kind: "bell" | "users" | "pin" | "check" }) {
  const c = ACCENT_SOFT;
  const stroke = `2.5px solid ${c}`;
  if (kind === "users")
    return (
      <div style={{ display: "flex", gap: 4 }}>
        <div style={{ width: 13, height: 13, borderRadius: 99, border: stroke }} />
        <div style={{ width: 13, height: 13, borderRadius: 99, border: stroke }} />
      </div>
    );
  if (kind === "bell")
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
        <div style={{ width: 18, height: 15, borderRadius: "9px 9px 3px 3px", border: stroke }} />
        <div style={{ width: 7, height: 3, borderRadius: 3, background: c }} />
      </div>
    );
  if (kind === "pin")
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div style={{ width: 15, height: 15, borderRadius: 99, border: stroke }} />
        <div style={{ width: 0, height: 0, borderLeft: "5px solid transparent", borderRight: "5px solid transparent", borderTop: `7px solid ${c}`, marginTop: -2 }} />
      </div>
    );
  return (
    <div style={{ width: 16, height: 9, borderLeft: stroke, borderBottom: stroke, transform: "rotate(-45deg) translate(2px, -3px)" }} />
  );
}

export default async function Image() {
  const [bold, medium] = await Promise.all([
    fetch(PRETENDARD_BOLD).then((r) => r.arrayBuffer()),
    fetch(PRETENDARD).then((r) => r.arrayBuffer()),
  ]);

  // 원판은 오른쪽으로 치우쳐 프레임 밖으로 살짝 나간다 (시네마틱 크롭)
  const cx = 960;
  const cy = 315;
  const R = 300;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          background: `radial-gradient(760px 560px at 80% 40%, rgba(124,108,246,0.28), transparent 62%), ${BG}`,
          color: "#ffffff",
          fontFamily: "Pretendard",
          overflow: "hidden",
        }}
      >
        {/* 바닥 지평선 — 앱 푸터의 큰 원판 윗부분 */}
        <div
          style={{
            position: "absolute",
            left: -700,
            top: 560,
            width: 2600,
            height: 2600,
            borderRadius: 9999,
            background: BG,
            boxShadow: "inset 0 14px 30px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.05)",
          }}
        />

        {/* 눌린 원판 + 링 */}
        <div
          style={{
            position: "absolute",
            left: cx - R,
            top: cy - R,
            width: R * 2,
            height: R * 2,
            borderRadius: 9999,
            background: BG,
            boxShadow:
              "inset 14px 14px 32px rgba(0,0,0,0.65), inset -10px -10px 24px rgba(255,255,255,0.04)",
          }}
        />
        <div style={{ position: "absolute", left: cx - 252, top: cy - 252, width: 504, height: 504, borderRadius: 9999, border: "2px dashed rgba(157,146,248,0.28)" }} />
        <div style={{ position: "absolute", left: cx - 160, top: cy - 160, width: 320, height: 320, borderRadius: 9999, border: "2px dashed rgba(157,146,248,0.4)" }} />

        {/* 혜성 */}
        <div style={{ position: "absolute", left: cx - 252 * 0.94 - 5, top: cy - 252 * 0.34 - 5, width: 10, height: 10, borderRadius: 99, background: ACCENT_SOFT, boxShadow: `0 0 16px 4px rgba(124,108,246,0.6)` }} />
        <div style={{ position: "absolute", left: cx + 160 * 0.5 - 4, top: cy + 160 * 0.86 - 4, width: 8, height: 8, borderRadius: 99, background: ACCENT_SOFT, boxShadow: `0 0 12px 3px rgba(124,108,246,0.6)` }} />

        {/* 중심 타일 */}
        <div
          style={{
            position: "absolute",
            left: cx - 72,
            top: cy - 72,
            width: 144,
            height: 144,
            borderRadius: 40,
            background: `linear-gradient(180deg, #9a8ef9 0%, ${ACCENT} 100%)`,
            boxShadow: "0 24px 50px rgba(124,108,246,0.5), 0 0 0 8px #111320, 0 0 0 9px rgba(255,255,255,0.05)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 68, height: 62, borderRadius: 14, border: "4px solid #ffffff", background: "rgba(255,255,255,0.12)" }}>
            <div style={{ width: 60, height: 13, borderRadius: "8px 8px 0 0", background: "#ffffff" }} />
            <div style={{ display: "flex", flexWrap: "wrap", width: 48, gap: 5, marginTop: 8 }}>
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <div key={i} style={{ width: 8, height: 8, borderRadius: 2, background: i === 4 ? "#ffffff" : "rgba(255,255,255,0.5)" }} />
              ))}
            </div>
          </div>
        </div>

        {/* 위성 */}
        <Satellite cx={cx} cy={cy} angle={-95} radius={252} size={66}><Glyph kind="pin" /></Satellite>
        <Satellite cx={cx} cy={cy} angle={40} radius={252} size={66}><Glyph kind="users" /></Satellite>
        <Satellite cx={cx} cy={cy} angle={150} radius={252} size={66}><Glyph kind="bell" /></Satellite>
        <Satellite cx={cx} cy={cy} angle={118} radius={160} size={54}><Glyph kind="check" /></Satellite>

        {/* 문구 */}
        <div
          style={{
            position: "absolute",
            left: 96,
            top: 0,
            height: "100%",
            width: 600,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          {/* 로고 마크 + 워드마크 */}
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: 10,
                background: `linear-gradient(180deg, #9a8ef9 0%, ${ACCENT} 100%)`,
                boxShadow: "0 6px 16px rgba(124,108,246,0.45)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div style={{ width: 16, height: 14, borderRadius: 4, border: "2.5px solid #fff", display: "flex", flexDirection: "column" }}>
                <div style={{ width: "100%", height: 4, background: "#fff" }} />
              </div>
            </div>
            <span style={{ fontSize: 22, fontWeight: 700, letterSpacing: 3, color: "#e6e7ef" }}>
              ONE<span style={{ color: MUTED, fontWeight: 500, marginLeft: 8 }}>SCHEDULE</span>
            </span>
          </div>

          <div
            style={{
              marginTop: 40,
              fontSize: 64,
              fontWeight: 700,
              lineHeight: 1.16,
              letterSpacing: -2.4,
              color: "#f4f4f8",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <span>팀의 일정을</span>
            <span style={{ display: "flex" }}>
              한눈에<span style={{ color: ACCENT_SOFT }}>.</span>
            </span>
          </div>

          <div style={{ marginTop: 22, fontSize: 24, fontWeight: 500, color: "#9a9db0", lineHeight: 1.5, letterSpacing: -0.3 }}>
            개인 일정과 그룹 일정, 하나의 캘린더에서.
          </div>

          <div style={{ marginTop: 54, display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 28, height: 1, background: "rgba(255,255,255,0.18)" }} />
            <span style={{ fontSize: 18, fontWeight: 500, color: "#7d8195", letterSpacing: 1.5 }}>ONESCHEDULE.SITE</span>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Pretendard", data: medium, weight: 500, style: "normal" },
        { name: "Pretendard", data: bold, weight: 700, style: "normal" },
      ],
    },
  );
}
