import { useQuery } from "@tanstack/react-query";
import { useAuth0 } from "@auth0/auth0-react";
import { fetchAllApplications, fetchApplication, type FetchApplicationParams } from "../api/applicationApi";
import { applicationQueries } from "../queries/applicationQueries";

export function useGetApplication(taskId: number) {
  const { getAccessTokenSilently, isAuthenticated } = useAuth0();

  return useQuery({
    queryKey: applicationQueries.ownApplication(taskId).queryKey,
    queryFn: () => fetchApplication(getAccessTokenSilently, taskId),
    enabled: isAuthenticated && !!taskId,
  })
}

export function useGetUserApplications(params: FetchApplicationParams){
  const { getAccessTokenSilently, isAuthenticated } = useAuth0();

  return useQuery({
    queryKey: applicationQueries.ownApplications(params).queryKey,
    queryFn: () => fetchAllApplications(getAccessTokenSilently, params),
    enabled: isAuthenticated,
  })
}
