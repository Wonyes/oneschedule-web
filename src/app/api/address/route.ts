import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const x = searchParams.get("x");
  const y = searchParams.get("y");

  if (!x || !y || Number.isNaN(Number(x)) || Number.isNaN(Number(y))) {
    return NextResponse.json(
      { message: "x, y 쿼리 파라미터가 필요합니다." },
      { status: 400 },
    );
  }

  if (!process.env.KAKAO_REST_API_KEY) {
    console.error("KAKAO_REST_API_KEY 환경변수가 설정되지 않았습니다.");
    return NextResponse.json(
      { message: "주소 변환을 사용할 수 없습니다." },
      { status: 503 },
    );
  }

  try {
    const response = await fetch(
      `https://dapi.kakao.com/v2/local/geo/coord2address.json?x=${x}&y=${y}`,
      {
        headers: {
          Authorization: `KakaoAK ${process.env.KAKAO_REST_API_KEY}`,
        },
        signal: AbortSignal.timeout(5000),
      },
    );

    if (!response.ok) {
      console.error("카카오 주소 변환 실패:", response.status);
      return NextResponse.json(
        { message: "주소를 변환하지 못했습니다." },
        { status: response.status },
      );
    }

    return NextResponse.json(await response.json());
  } catch (error) {
    console.error("카카오 주소 변환 요청 실패:", error);
    return NextResponse.json(
      { message: "주소 변환 요청에 실패했습니다." },
      { status: 502 },
    );
  }
}
