import { useState, useEffect, useCallback } from 'react';
import { fetchTasks, FetchTasksParams } from '../api/get';
import type { Task, PaginatedResponse} from '../types';

export function useTasks(params?: FetchTasksParams) {
  const [data, setData] = useState<PaginatedResponse<Task> | null>(null);

  const load = useCallback(async () => {
    const result = await fetchTasks(params || {});
    setData(result);
  }, [params]);

  useEffect(() => {
    load();
  }, [load]);

  return { data, refetch: load };
}