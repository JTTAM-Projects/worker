import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createTask, type CreateTaskInput } from "../api/taskApi";
import { useAuth0 } from "@auth0/auth0-react";

export function useCreateTask() {
  const { getAccessTokenSilently } = useAuth0();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateTaskInput) =>
      createTask(getAccessTokenSilently, input),

    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["tasks"] });
      qc.invalidateQueries({ queryKey: ["userTasks"] });
    },
  });
}
