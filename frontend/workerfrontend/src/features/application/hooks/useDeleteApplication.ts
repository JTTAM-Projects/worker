import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../../../auth/useAuth";
import { deleteApplication } from "../api/applicationApi";

export interface DeleteApplicationInput {
  taskId: number;
}

export function useDeleteApplication() {
  const { getAccessTokenSilently } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ taskId }: DeleteApplicationInput) =>
      deleteApplication(getAccessTokenSilently, taskId),
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
