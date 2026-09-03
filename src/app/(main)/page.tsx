import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { cookies } from "next/headers";

import GuestHome from "@/src/components/home/GuestHome";
import HomeContent from "@/src/components/home/HomeContent";
import { groupkeys } from "@/src/hooks/querys/key/groupKey";
import { memberskeys } from "@/src/hooks/querys/key/members";
import { scheduleKeys } from "@/src/hooks/querys/key/scheduleKey";
import {
  ACTIVE_GROUP_COOKIE,
  parseActiveGroupNo,
  resolveActiveGroup,
} from "@/src/lib/activeGroup";
import { getMyInfo } from "@/src/lib/member";
import { getServerQueryClient } from "@/src/lib/queryClient";
import { serverGet } from "@/src/lib/serverApi";
import { MyGroupResponse } from "@/src/types/group";
import { ScheduleApiResponse } from "@/src/types/schedule";

export default async function HomePage() {
  const cookieStore = await cookies();

  if (!cookieStore.get("access-token")) {
    return <GuestHome />;
  }

  const queryClient = getServerQueryClient();

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

  const prefetched = queryClient.getQueryData<
    MyGroupResponse | MyGroupResponse[]
  >([groupkeys.myGroup]);

  const groups = !prefetched
    ? []
    : Array.isArray(prefetched)
      ? prefetched
      : [prefetched];

  const activeGroup = resolveActiveGroup(
    groups,
    parseActiveGroupNo(cookieStore.get(ACTIVE_GROUP_COOKIE)?.value),
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <HomeContent user={user} initialGroups={groups} activeGroup={activeGroup} />
    </HydrationBoundary>
  );
}
