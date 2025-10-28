import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchTaskById, updateTask, type CreateTaskInput } from "../api/taskApi";
import { useAuth0 } from "@auth0/auth0-react";

export function useTask(taskId: number | undefined) {
  return useQuery({
    queryKey: ["task", taskId],
    queryFn: () => {
      if (taskId === undefined) {
        throw new Error("taskId puuttuu");
      }
      return fetchTaskById(taskId);
    },
    enabled: taskId !== undefined,
  });
}

export function useUpdateTask(taskId: number) {
  const { getAccessTokenSilently } = useAuth0();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateTaskInput) =>
      updateTask(getAccessTokenSilently, taskId, input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["task", taskId] });
      qc.invalidateQueries({ queryKey: ["tasks"] });
      qc.invalidateQueries({ queryKey: ["userTasks"] });
    },
  });
}
