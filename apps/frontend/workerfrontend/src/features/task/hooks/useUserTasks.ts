import { useQuery } from '@tanstack/react-query';
import { useAuth0 } from '@auth0/auth0-react';
import { type FetchTasksParams } from '../api/taskApi';
import { taskQueries } from '../queries/taskQueries';

export function useUserTasks(params: FetchTasksParams) {
  const { getAccessTokenSilently } = useAuth0();

  return useQuery(taskQueries.own(getAccessTokenSilently, params))
}
