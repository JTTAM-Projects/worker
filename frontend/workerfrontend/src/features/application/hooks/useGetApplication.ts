import { useQuery } from "@tanstack/react-query";
import { useAuth0 } from "@auth0/auth0-react";
import { fetchAllApplications, fetchApplication, type FetchApplicationParams } from "../api/applicationApi";

export function useGetApplication(taskId: number) {
  const { getAccessTokenSilently, isAuthenticated } = useAuth0();

  return useQuery({
    queryKey: ['applications', 'detail', taskId],
    queryFn: () => fetchApplication(getAccessTokenSilently, taskId),
    enabled: isAuthenticated && !!taskId,
    staleTime: 5 * 60 * 1000,
  })
}

export function useGetUserApplications(params: FetchApplicationParams){
  const { getAccessTokenSilently, isAuthenticated } = useAuth0();

  return useQuery({
    queryKey: ['applications', 'list', params],
    queryFn: () => fetchAllApplications(getAccessTokenSilently, params),
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000,
  })
}
