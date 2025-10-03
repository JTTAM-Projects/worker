import { useQuery } from '@tanstack/react-query';
import { fetchTasks } from '../api/taskApi';
import type { FetchTasksParams } from '../api/taskApi';

export function useTasks(params: FetchTasksParams = {}) {
  return useQuery({
    queryKey: ['tasks', params],
    queryFn: () => fetchTasks(params),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
