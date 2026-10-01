"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

import { groupkeys } from "@/src/hooks/querys/key/groupKey";
import { useUpdateGroupSetting } from "@/src/hooks/querys/useGroup";
import { Put } from "@/src/hooks/querys/useMutations";
import { useOverlay } from "@/src/hooks/useOverlay";
import { getErrorMessage, useAppMutation } from "@/src/types/ErrorResponse";
import { MyGroupResponse } from "@/src/types/group";

/** 히어로에서 그룹 이름·소개를 함께 편집. 바뀐 것만 저장한다 */
export function useGroupHeroEdit(group: MyGroupResponse) {
  const queryClient = useQueryClient();
  const { openToast } = useOverlay();

  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(group.groupName);
  const [description, setDescription] = useState(group.description ?? "");

  const toast = (message: string) => openToast({ message });

  const { mutate: changeName, isPending: savingName } = useAppMutation({
    mutationFn: () =>
      Put({
        url: `/group/group-name/${group.groupNo}`,
        body: null,
        params: { groupName: name.trim() },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [groupkeys.myGroup] });
      toast("그룹 이름이 변경되었습니다.");
    },
    onError: (err) => toast(getErrorMessage(err)),
    retry: false,
  });

  const { mutate: changeDescription, isPending: savingDescription } =
    useUpdateGroupSetting(group.groupNo);

  const start = () => {
    setName(group.groupName);
    setDescription(group.description ?? "");
    setEditing(true);
  };

  const cancel = () => setEditing(false);

  const save = () => {
    if (name.trim() !== group.groupName) changeName();
    if (description.trim() !== (group.description ?? "")) {
      changeDescription(
        { description: description.trim() },
        {
          onSuccess: () => toast("그룹 소개를 저장했습니다."),
          onError: (err) => toast(getErrorMessage(err)),
        },
      );
    }
    setEditing(false);
  };

  return {
    editing,
    name,
    description,
    saving: savingName || savingDescription,
    onNameChange: (e: React.ChangeEvent<HTMLInputElement>) =>
      setName(e.target.value),
    onDescriptionChange: setDescription,
    start,
    cancel,
    save,
  };
}
