import { useQuery } from "@tanstack/react-query";
import { Get } from "./useMutations";
import { groupkeys } from "./key/groupKey";
import { MyGroupResponse } from "@/src/types/group";

export const useMyGroup = (enabled = true, initialData?: MyGroupResponse) => {
  return useQuery({
    queryKey: [groupkeys.myGroup],

    queryFn: () =>
      Get<MyGroupResponse>({
        url: "/group/my",
      }),

    enabled,
    retry: false,
    staleTime: Infinity,
    initialData,
  });
};
