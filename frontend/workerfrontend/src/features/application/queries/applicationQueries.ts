import { queryOptions } from "@tanstack/react-query"
import type { FetchApplicationParams } from "../api/applicationApi"

export const applicationQueries = {
  ownApplication: (taskId: number) => 
    queryOptions({
      queryKey: ['applications', 'detail', taskId],
      staleTime: 5 * 60 * 1000,
    }),

  ownApplications: (params: FetchApplicationParams) =>
    queryOptions({    
      queryKey: ['applications', 'list', params],
      staleTime: 5 * 60 * 1000,
    })
}