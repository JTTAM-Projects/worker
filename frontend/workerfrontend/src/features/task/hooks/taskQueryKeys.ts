import type { FetchTasksParams } from '../api/taskApi';

/**
 * Query key factory for task-related queries.
 * Provides structured, hierarchical keys for better cache invalidation.
 * @see https://tanstack.com/query/latest/docs/react/guides/query-keys#query-key-factories
 */
export const taskQueryKeys = {
  all: ['tasks'] as const,
  lists: () => [...taskQueryKeys.all, 'list'] as const,
  list: (params: FetchTasksParams) => [...taskQueryKeys.lists(), params] as const,
  allFiltered: (params: Omit<FetchTasksParams, 'page' | 'size'>) => 
    [...taskQueryKeys.all, 'allFiltered', params] as const,
  userLists: () => [...taskQueryKeys.all, 'user'] as const,
  userList: (params: FetchTasksParams) => [...taskQueryKeys.userLists(), params] as const,
  details: () => [...taskQueryKeys.all, 'detail'] as const,
  detail: (id: number) => [...taskQueryKeys.details(), id] as const,
  applicationLists: () => [...taskQueryKeys.all, 'applications'] as const,
  applications: (taskId: number, page: number, size: number) => 
    [...taskQueryKeys.applicationLists(), taskId, page, size] as const,
};
