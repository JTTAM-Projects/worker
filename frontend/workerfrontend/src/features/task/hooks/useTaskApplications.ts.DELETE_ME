import { useQuery } from "@tanstack/react-query";
import { fetchTaskApplications } from "../api/taskApi";

export function useTaskApplications(taskId: number, page = 0, size = 10) {
  return useQuery({
    queryKey: ["taskApplications", taskId, page, size],
    queryFn: () => fetchTaskApplications(taskId, { page, size }),
    enabled: !!taskId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
