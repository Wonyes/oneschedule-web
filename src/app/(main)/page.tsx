import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { cookies } from "next/headers";

import GuestHome from "@/src/components/home/GuestHome";
import HomeContent from "@/src/components/home/HomeContent";
import { groupkeys } from "@/src/hooks/querys/key/groupKey";
import { memberskeys } from "@/src/hooks/querys/key/members";
import { scheduleKeys } from "@/src/hooks/querys/key/scheduleKey";
import { getMyInfo } from "@/src/lib/member";
import { getServerQueryClient } from "@/src/lib/queryClient";
import { serverGet } from "@/src/lib/serverApi";
import { MyGroupResponse } from "@/src/types/group";
import { ScheduleApiResponse } from "@/src/types/schedule";

export default async function HomePage() {
  const cookieStore = await cookies();

  // 토큰이 없으면 어차피 전부 401이므로 왕복 없이 바로 게스트 화면
  if (!cookieStore.get("access-token")) {
    return <GuestHome />;
  }

  const queryClient = getServerQueryClient();

  // 세 호출은 서로 의존하지 않으므로 병렬로 돌린다.
  // 실패한 prefetch는 dehydrate에서 빠져 클라이언트가 다시 받아온다.
  const [user] = await Promise.all([
    getMyInfo(),

    queryClient.prefetchQuery({
      queryKey: [scheduleKeys.list, "PERSONAL"],
      queryFn: () =>
        serverGet<ScheduleApiResponse[]>("/schedules", { type: "PERSONAL" }),
    }),

    queryClient.prefetchQuery({
      queryKey: [groupkeys.myGroup],
      queryFn: () => serverGet<MyGroupResponse>("/group/my"),
    }),
  ]);

  if (!user) {
    return <GuestHome />;
  }

  queryClient.setQueryData([memberskeys.myInfo], user);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <HomeContent user={user} />
    </HydrationBoundary>
  );
}
