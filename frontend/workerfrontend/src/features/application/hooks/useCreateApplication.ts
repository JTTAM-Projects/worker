import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth0 } from "@auth0/auth0-react";
import { createApplication } from "../api/applicationApi";
import type { CreateApplicationInput } from "../types";

export function useCreateApplication() {
  const { getAccessTokenSilently } = useAuth0();
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
