import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../../../auth/useAuth";
import { createApplication } from "../api/applicationApi";
import type { ApplicationPayload } from "../api/applicationApi.types";

export interface CreateApplicationInput {
  taskId: number;
  payload: ApplicationPayload;
}

export function useCreateApplication() {
  const { getAccessTokenSilently } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ taskId, payload }: CreateApplicationInput) =>
      createApplication(getAccessTokenSilently, taskId, payload),
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
