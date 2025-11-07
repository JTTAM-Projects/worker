import { useQuery } from "@tanstack/react-query";
import { fetchTaskById } from "../api/taskApi";

export function useTaskById(taskId: number) {
  return useQuery({
    queryKey: ["task", taskId],
    queryFn: () => fetchTaskById(taskId),
    enabled: !!taskId,
  });
}
