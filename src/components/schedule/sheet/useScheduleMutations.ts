"use client";

import { useQueryClient } from "@tanstack/react-query";

import { scheduleKeys } from "@/src/hooks/querys/key/scheduleKey";
import {
  createGroupSchedule,
  createSchedule,
  deleteSchedule,
  updateSchedule,
} from "@/src/hooks/querys/useSchedule";
import { useOverlay } from "@/src/hooks/useOverlay";
import { getErrorMessage, useAppMutation } from "@/src/types/ErrorResponse";
import { toScheduleRequest } from "@/src/utils/schedule";

type Body = ReturnType<typeof toScheduleRequest>;

/** 시트의 저장·수정·삭제. 성공하면 목록을 무효화하고 onDone(시트 닫기) */
export function useScheduleMutations({
  groupNo,
  onDone,
}: {
  /** 있으면 그룹 일정으로 생성 */
  groupNo?: number;
  onDone: () => void;
}) {
  const queryClient = useQueryClient();
  const { openAlert } = useOverlay();

  const done = () => {
    queryClient.invalidateQueries({ queryKey: [scheduleKeys.list] });
    onDone();
  };
  const fail =
    (title: string) => (err: Parameters<typeof getErrorMessage>[0]) =>
      openAlert({ title, message: getErrorMessage(err) });

  const { mutate: create } = useAppMutation({
    mutationFn: (body: Body) =>
      groupNo !== undefined
        ? createGroupSchedule(groupNo, body)
        : createSchedule(body),
    onSuccess: done,
    onError: fail("일정 저장에 실패했습니다."),
  });

  const { mutate: update } = useAppMutation({
    mutationFn: ({ id, body }: { id: number; body: Body }) =>
      updateSchedule(id, body),
    onSuccess: done,
    onError: fail("일정 수정에 실패했습니다."),
  });

  const { mutate: remove } = useAppMutation({
    mutationFn: deleteSchedule,
    onSuccess: done,
    onError: fail("일정 삭제에 실패했습니다."),
  });

  return { create, update, remove };
}
