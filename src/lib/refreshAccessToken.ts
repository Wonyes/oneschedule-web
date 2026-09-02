export async function refreshAccessToken(cookieHeader: string) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_IP}/v1/api/token-refresh`,
      {
        method: "POST",
        headers: {
          Cookie: cookieHeader,
        },
      },
    );

    return res.ok ? res : null;
  } catch (error) {
    console.error("토큰 재발급 요청 실패:", error);
    return null;
  }
}
