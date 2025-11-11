import { useQuery } from "@tanstack/react-query";
import { taskQueries } from "../queries/taskQueries";

export function useTaskApplications(taskId: number, page = 0, size = 10) {
  return useQuery(taskQueries.applications(taskId, page, size));
}
