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

  const response = await fetch(
    `https://dapi.kakao.com/v2/local/geo/coord2address.json?x=${x}&y=${y}`,
    {
      headers: {
        Authorization: `KakaoAK ${process.env.KAKAO_REST_API_KEY}`,
      },
    },
  );

  const data = await response.json();
  return NextResponse.json(data, { status: response.status });
}
