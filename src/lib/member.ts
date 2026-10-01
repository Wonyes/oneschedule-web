import { cookies } from "next/headers";

import { MyInfoResponse } from "@/src/hooks/querys/useMembers";
import { serverGet } from "./serverApi";

export async function getMyInfo() {
  const cookieStore = await cookies();

  if (!cookieStore.get("access-token")) {
    return null;
  }

  try {
    return await serverGet<MyInfoResponse>("/members/info");
  } catch {
    return null;
  }
}
