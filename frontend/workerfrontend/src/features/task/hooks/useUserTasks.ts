import { useQuery } from '@tanstack/react-query';
import { useAuth0 } from '@auth0/auth0-react';
import { fetchUserTasks, type FetchTasksParams } from '../api/taskApi';
import { taskQueries } from '../queries/taskQueries';

export function useUserTasks(params: FetchTasksParams = {}) {
  const { getAccessTokenSilently, isAuthenticated } = useAuth0();

  return useQuery({
    queryKey: taskQueries.own(params).queryKey,
    queryFn: async () => {
      const token = await getAccessTokenSilently();
      return fetchUserTasks(token, params);
    },
    enabled: isAuthenticated,
  });
}
