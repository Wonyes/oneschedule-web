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
) => {
  return useQuery({
    queryKey: [scheduleKeys.list, type],
    queryFn: () =>
      Get<ScheduleApiResponse[]>({
        url: "/schedules",
        params: { type },
      }),
    enabled,
    retry: false,
  });
};

export const createSchedule = (body: ScheduleApiRequest) =>
  Post<ScheduleApiResponse>({ url: "/schedules", body });

export const createGroupSchedule = (body: ScheduleApiRequest) =>
  Post<ScheduleApiResponse>({ url: "/schedules/group", body });

export const updateSchedule = (id: number, body: ScheduleApiRequest) =>
  Put<ScheduleApiResponse>({ url: `/schedules/${id}`, body });

export const deleteSchedule = (id: number) =>
  Delete<void>({ url: `/schedules/${id}` });
