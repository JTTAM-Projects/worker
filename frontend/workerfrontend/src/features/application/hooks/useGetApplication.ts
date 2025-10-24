import { useQuery } from "@tanstack/react-query";
import { useAuth0 } from "@auth0/auth0-react";
import { fetchAllApplications, fetchApplication, type FetchApplicationParams } from "../api/applicationApi";
import type { ApplicationWithDetails } from "../types";

export function useGetApplication(taskId: number) {
  const { getAccessTokenSilently, isAuthenticated } = useAuth0();

  return useQuery({
    queryKey: ['application', taskId],
    queryFn: () => fetchApplication(getAccessTokenSilently, taskId),
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000,
  })
}

export function useGetAllUserApplications(params: FetchApplicationParams){
  const { getAccessTokenSilently, isAuthenticated } = useAuth0();

  return useQuery<ApplicationWithDetails[]>({
    queryKey: ['application', params],
    queryFn: () => fetchAllApplications(getAccessTokenSilently, params),
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000,
  })
}