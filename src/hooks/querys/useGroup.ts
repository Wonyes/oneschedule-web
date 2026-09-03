import { useQuery } from "@tanstack/react-query";
import { Get } from "./useMutations";
import { groupkeys } from "./key/groupKey";
import { MyGroupResponse } from "@/src/types/group";
import { resolveActiveGroup } from "@/src/lib/activeGroup";
import { useActiveGroupStore } from "../stores/useActiveGroupStore";

export const useMyGroups = (
  enabled = true,
  initialData?: MyGroupResponse[],
) => {
  return useQuery({
    queryKey: [groupkeys.myGroup],

    queryFn: async () => {
      const data = await Get<MyGroupResponse | MyGroupResponse[] | null>({
        url: "/group/my/groups",
      });

      if (!data) return [];

      const list = Array.isArray(data) ? data : [data];
      return list.map((group) => ({ ...group, members: group.members ?? [] }));
    },

    enabled,
    retry: false,
    staleTime: Infinity,
    initialData,
  });
};

export const useActiveGroup = (
  enabled = true,
  initialGroups?: MyGroupResponse[],
) => {
  const { data: groups, ...rest } = useMyGroups(enabled, initialGroups);
  const activeGroupNo = useActiveGroupStore((s) => s.activeGroupNo);

  const list = groups ?? [];
  const saved = list.find((g) => g.groupNo === activeGroupNo);

  const needsSelection = !saved && list.length > 1;

  return {
    ...rest,
    groups: list,
    needsSelection,
    group: needsSelection ? undefined : resolveActiveGroup(list, activeGroupNo),
  };
};
