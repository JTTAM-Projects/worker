import { queryOptions } from "@tanstack/react-query";
import {
  fetchTaskApplications,
  fetchTaskById,
  fetchTasks,
  fetchUserTasks,
  fetchWorkerTasks,
  type FetchTasksParams,
} from "../api/taskApi";

export const taskQueries = {
  /** Fetch paginated tasks with filters (public, no auth) */
  all: (params: FetchTasksParams = { status: "ACTIVE", sortBy: "newest" }) =>
    queryOptions({
      queryKey: ["tasks", "all", params],
      queryFn: () => fetchTasks(params),
      staleTime: 5 * 60 * 1000, // 5 minuuttia
    }),

  /** Fetch ALL filtered tasks for map view (up to 1000, no pagination) */
  allFiltered: (filters: Omit<FetchTasksParams, "page" | "size"> = {}) =>
    queryOptions({
      queryKey: ["tasks", "allFiltered", filters],
      queryFn: () => fetchTasks({ ...filters, page: 0, size: 1000 }),
      staleTime: 5 * 60 * 1000,
    }),

  /** Fetch single task by ID */
  detail: (taskId: string) =>
    queryOptions({
      queryKey: ["tasks", "detail", taskId],
      queryFn: () => fetchTaskById(parseInt(taskId)),
    }),

  /** Fetch applications for a task */
  applications: (taskId: number, page = 0, size = 10) =>
    queryOptions({
      queryKey: ["taskApplications", taskId, page, size],
      queryFn: () => fetchTaskApplications(taskId, { page, size }),
      enabled: !!taskId,
      staleTime: 5 * 60 * 1000, // 5 minutes
    }),

  /** Fetch authenticated user's own tasks */
  own: (getAccessTokenSilently: () => Promise<string>, params: FetchTasksParams = {}) =>
    queryOptions({
      queryKey: ["tasks", "own", params],
      queryFn: () => fetchUserTasks(getAccessTokenSilently, params),
      staleTime: 5 * 60 * 1000, // 5 minutes
    }),

  /** Fetch tasks for worker */
  worker: (getAccessTokenSilently: () => Promise<string>, params: FetchTasksParams = {}) =>
    queryOptions({
      queryKey: ["tasks", "worker", params],
      queryFn: () => fetchWorkerTasks(getAccessTokenSilently, params),
      staleTime: 5 * 60 * 1000, // 5 minutes
    }),
};
