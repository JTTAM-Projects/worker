import { queryOptions } from "@tanstack/react-query";
import { fetchTaskApplications, fetchTaskById, fetchTasks, type FetchTasksParams } from "../api/taskApi";

export const taskQueries = {
  all: (params: FetchTasksParams = { status: "ACTIVE", sortBy: "newest" }) =>
    queryOptions({
      queryKey: ["tasks", "all", params],
      queryFn: () => fetchTasks(params),
      staleTime: 5 * 60 * 1000, // 5 minuuttia
    }),

  detail: (taskId: string) =>
    queryOptions({
      queryKey: ["tasks", "detail", taskId],
      queryFn: () => fetchTaskById(parseInt(taskId)),
    }),

  applications: (taskId: number, page = 0, size = 10) =>
    queryOptions({
      queryKey: ["taskApplications", taskId, page, size],
      queryFn: () => fetchTaskApplications(taskId, { page, size }),
      enabled: !!taskId,
      staleTime: 5 * 60 * 1000, // 5 minutes
    }),

  own: (params: FetchTasksParams = {}) =>
    queryOptions({
      queryKey: ["tasks", "own", params],
      staleTime: 5 * 60 * 1000, // 5 minutes
    }),
};
