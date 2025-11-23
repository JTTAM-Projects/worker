import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../../../auth/useAuth";
import { fetchApplication, type FetchApplicationParams } from "../api/applicationApi";
import { applicationQueries } from "../queries/applicationQueries";

export function useGetApplication(taskId: number) {
  const { getAccessTokenSilently, isAuthenticated } = useAuth();

  return useQuery({
    queryKey: applicationQueries.ownApplication(taskId).queryKey,
    queryFn: () => fetchApplication(getAccessTokenSilently, taskId),
    enabled: isAuthenticated && !!taskId,
  })
}

export function useGetUserApplications(params: FetchApplicationParams){
  const { getAccessTokenSilently } = useAuth();

  return useQuery(applicationQueries.ownApplications(getAccessTokenSilently, params))
}
