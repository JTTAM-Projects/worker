import { queryOptions } from "@tanstack/react-query"
import { fetchAllApplications, type FetchApplicationParams } from "../api/applicationApi"

export const applicationQueries = {
  ownApplication: (taskId: number) => 
    queryOptions({
      queryKey: ['applications', 'detail', taskId],
      staleTime: 5 * 60 * 1000,
    }),

  ownApplications: (getAccessTokenSilently: () => Promise<string>, params: FetchApplicationParams) =>
    queryOptions({    
      queryKey: ['applications', 'list', params],
      queryFn: () => fetchAllApplications(getAccessTokenSilently, params),
      staleTime: 5 * 60 * 1000,
    })
}