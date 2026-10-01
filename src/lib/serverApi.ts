import { cookies } from "next/headers";

export async function serverGet<T>(
  path: string,
  params?: Record<string, string>,
): Promise<T> {
  const cookieStore = await cookies();

  const url = new URL(`${process.env.NEXT_PUBLIC_SERVER_IP}/v1/api${path}`);
  Object.entries(params ?? {}).forEach(([key, value]) => {
    url.searchParams.set(key, value);
  });

  const res = await fetch(url, {
    headers: { Cookie: cookieStore.toString() },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`GET ${path} 실패 (${res.status})`);
  }

  const data = await res.json();

  return (data.result ?? data) as T;
}
