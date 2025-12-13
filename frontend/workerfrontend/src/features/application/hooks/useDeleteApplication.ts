import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth0 } from "@auth0/auth0-react";
import { deleteApplication } from "../api/applicationApi";
import type { DeleteApplicationInput } from "../types";

export function useDeleteApplication() {
  const { getAccessTokenSilently } = useAuth0();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ taskId }: DeleteApplicationInput) => deleteApplication(getAccessTokenSilently, taskId),
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
