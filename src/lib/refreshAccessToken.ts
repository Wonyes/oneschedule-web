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
  } catch {
    return null;
  }
}
