import { useQuery } from "@tanstack/react-query";
import { Get, Post, Put, Delete } from "./useMutations";
import { scheduleKeys } from "./key/scheduleKey";
import {
  ScheduleApiRequest,
  ScheduleApiResponse,
  ScheduleViewType,
} from "@/src/types/schedule";

export const useSchedules = (
  type: ScheduleViewType = "PERSONAL",
  enabled = true,
  groupNo?: number,
) => {
  const isGroup = type === "GROUP";

  return useQuery({
    queryKey: [scheduleKeys.list, type, isGroup ? (groupNo ?? null) : null],
    queryFn: () =>
      Get<ScheduleApiResponse[]>({
        url: "/schedules",
        params: isGroup && groupNo ? { type, groupNo } : { type },
      }),
    enabled: enabled && (!isGroup || !!groupNo),
    retry: false,
  });
};

export const createSchedule = (body: ScheduleApiRequest) =>
  Post<ScheduleApiResponse>({ url: "/schedules", body });

export const createGroupSchedule = (
  groupNo: number,
  body: ScheduleApiRequest,
) =>
  Post<ScheduleApiResponse>({
    url: `/schedules/group`,
    params: { groupNo },
    body,
  });

export const updateSchedule = (id: number, body: ScheduleApiRequest) =>
  Put<ScheduleApiResponse>({
    url: `/schedules/${id}`,
    body,
  });

export const deleteSchedule = (id: number) =>
  Delete<void>({ url: `/schedules/${id}` });
