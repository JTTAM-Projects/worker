import { useQuery } from '@tanstack/react-query';
import { useAuth0 } from '@auth0/auth0-react';
import { fetchUserTasks, type FetchTasksParams } from '../api/taskApi';

export function useUserTasks(params: FetchTasksParams = {}) {
  const { getAccessTokenSilently, isAuthenticated } = useAuth0();

  return useQuery({
    queryKey: ['userTasks', params],
    queryFn: () => fetchUserTasks(getAccessTokenSilently, params),
    enabled: isAuthenticated, // Only fetch if user is authenticated
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
