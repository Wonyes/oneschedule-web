import { cookies } from "next/headers";

/**
 * 서버 컴포넌트에서 백엔드를 호출한다.
 * 브라우저의 axios 인스턴스와 달리 쿠키가 자동으로 실리지 않으므로 직접 전달한다.
 * 응답 형태(result 언래핑)는 클라이언트의 Get과 동일하게 맞춘다.
 *
 * 실패 시 throw 한다. prefetchQuery에 그대로 넘겼을 때 실패한 쿼리가
 * dehydrate에서 제외되어, 클라이언트가 스스로 다시 받아오게 하기 위함이다.
 * (null을 반환하면 "성공했는데 값이 null"로 하이드레이션되어 재요청이 막힌다)
 */
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
