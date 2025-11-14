import { useQuery } from '@tanstack/react-query';
import type { FetchTasksParams } from '../api/taskApi';
import { taskQueries } from '../queries/taskQueries';

export function useTasks(params: FetchTasksParams = {}) {
  return (useQuery(taskQueries.all(params)))
}
