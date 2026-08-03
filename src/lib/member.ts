import { cookies } from "next/headers";

export async function getMyInfo() {
  const cookieStore = await cookies();

  const accessToken = cookieStore.get("access-token");

  if (!accessToken) {
    return null;
  }

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_IP}/v1/api/members/info`,
    {
      headers: {
        Cookie: `access-token=${accessToken.value}`,
      },
      cache: "no-store",
    },
  );

  if (!res.ok) {
    return null;
  }

  const data = await res.json();

  return data.result ?? data;
}
