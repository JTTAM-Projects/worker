import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../../../auth/useAuth";
import { updateApplication } from "../api/applicationApi";
import type { ApplicationPayload } from "../api/applicationApi.types";

export interface UpdateApplicationInput {
  taskId: number;
  payload: ApplicationPayload;
}

export function useUpdateApplication() {
  const { getAccessTokenSilently } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ taskId, payload }: UpdateApplicationInput) =>
      updateApplication(getAccessTokenSilently, taskId, payload),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["applications", "detail", variables.taskId],
      });
      queryClient.invalidateQueries({ queryKey: ["applications", "list"] });
      queryClient.invalidateQueries({
        queryKey: ["taskApplications", variables.taskId],
      });
    },
  });
}
