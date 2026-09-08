import { ImageResponse } from "next/og";

/**
 * 카카오톡·슬랙 등에 링크를 붙였을 때 뜨는 미리보기 이미지.
 *
 * 파일을 두는 대신 만들어서 내보낸다. 문구를 고칠 때 이미지 편집기를 열지
 * 않아도 되고, 배포 이미지와 코드가 어긋날 일도 없다.
 *
 * 1200x630은 카카오톡·오픈그래프 공통 권장 비율이다. 이보다 작으면 카카오톡이
 * 작은 썸네일로 떨어뜨린다.
 */
export const alt = "OneSchedule — 나와 우리 팀의 일정을 한 곳에서";

export const size = { width: 1200, height: 630 };

export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "center",
        padding: "0 96px",
        background: "linear-gradient(135deg, #14161e 0%, #1e2130 100%)",
        color: "#ffffff",
      }}
    >
      <div
        style={{
          fontSize: 28,
          letterSpacing: 8,
          color: "#8b8fa3",
        }}
      >
        ONE SCHEDULER
      </div>

      <div
        style={{
          marginTop: 28,
          fontSize: 76,
          fontWeight: 700,
          lineHeight: 1.25,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <span>나와 우리 팀의 일정을</span>
        <span>한 곳에서 관리하세요</span>
      </div>

      <div
        style={{
          marginTop: 36,
          fontSize: 30,
          color: "#a5a9bd",
        }}
      >
        개인 일정과 그룹 일정을 함께 보고, 겹치는 시간도 한눈에.
      </div>

      <div
        style={{
          marginTop: 48,
          display: "flex",
          alignItems: "center",
          gap: 16,
        }}
      >
        <div
          style={{
            width: 14,
            height: 14,
            borderRadius: 999,
            background: "#7c6cf5",
          }}
        />
        <span style={{ fontSize: 26, color: "#7c6cf5" }}>oneschedule.site</span>
      </div>
    </div>,
    size,
  );
}
