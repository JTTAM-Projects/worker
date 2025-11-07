import { useQuery } from '@tanstack/react-query';
import { useAuth0 } from '@auth0/auth0-react';
import { fetchTasks, fetchUserTasks, fetchTaskById, fetchTaskApplications } from '../api/taskApi';
import type { FetchTasksParams } from '../api/taskApi';
import { taskQueryKeys } from './taskQueryKeys';

/** Fetch paginated tasks with optional filters */
export function useTasks(params: FetchTasksParams = {}) {
  return useQuery({
    queryKey: taskQueryKeys.list(params),
    queryFn: () => fetchTasks(params),
    staleTime: 5 * 60 * 1000,
  });
}

/** Fetch authenticated user's tasks with optional filters */
export function useUserTasks(params: FetchTasksParams = {}) {
  const { getAccessTokenSilently, isAuthenticated } = useAuth0();

  return useQuery({
    queryKey: taskQueryKeys.userList(params),
    queryFn: () => fetchUserTasks(getAccessTokenSilently, params),
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000,
  });
}

/** Fetch a single task by ID */
export function useTaskById(taskId: number) {
  return useQuery({
    queryKey: taskQueryKeys.detail(taskId),
    queryFn: () => fetchTaskById(taskId),
    enabled: !!taskId,
    staleTime: 5 * 60 * 1000,
  });
}

/** Fetch applications for a specific task */
export function useTaskApplications(taskId: number, page = 0, size = 10) {
  return useQuery({
    queryKey: taskQueryKeys.applications(taskId, page, size),
    queryFn: () => fetchTaskApplications(taskId, { page, size }),
    enabled: !!taskId,
    staleTime: 5 * 60 * 1000,
  });
}
