import { useQuery } from "@tanstack/react-query";
import { taskQueries } from "../queries/taskQueries";

export function useTaskById(taskId: number) {
  return useQuery(taskQueries.detail(taskId));
}
