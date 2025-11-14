import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { updateTask, type CreateTaskInput } from "../api/taskApi";
import { useAuth0 } from "@auth0/auth0-react";
import { taskQueries } from "../queries/taskQueries";

export function useTask(taskId: string) {
  return useQuery(taskQueries.detail(taskId));
}

export function useUpdateTask(taskId: number) {
  const { getAccessTokenSilently } = useAuth0();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateTaskInput) =>
      updateTask(getAccessTokenSilently, taskId, input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
}
