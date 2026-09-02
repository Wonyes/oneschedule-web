import { cookies } from "next/headers";

import { MyInfoResponse } from "@/src/hooks/querys/useMembers";
import { serverGet } from "./serverApi";

export async function getMyInfo() {
  const cookieStore = await cookies();

  // 액세스 토큰이 아예 없으면 401이 확정이므로 왕복을 건너뛴다
  if (!cookieStore.get("access-token")) {
    return null;
  }

  try {
    return await serverGet<MyInfoResponse>("/members/info");
  } catch {
    return null;
  }
}
