import { useQuery } from '@tanstack/react-query';
import { fetchTasks, fetchUserTasks, fetchTaskById, fetchTaskApplications } from '../api/taskApi';
import type { FetchTasksParams } from '../api/taskApi.types';
import { taskQueryKeys } from './taskQueryKeys';
import { useAuth } from '../../../auth/useAuth';

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
  const { getAccessTokenSilently, isAuthenticated } = useAuth();

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

/**
 * Fetch ALL filtered tasks (up to 1000) for map view
 * Note: This hook fetches without pagination for displaying all results on a map
 */
export function useAllFilteredTasks(
  filters: Omit<FetchTasksParams, 'page' | 'size'> = {},
  options?: { enabled?: boolean }
) {
  return useQuery({
    queryKey: taskQueryKeys.allFiltered(filters),
    queryFn: () => fetchTasks({ ...filters, page: 0, size: 1000 }),
    enabled: options?.enabled ?? true,
    staleTime: 5 * 60 * 1000,
  });
}
