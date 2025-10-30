import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateApplicationStatus } from "../api/taskApi";
import { useAuth0 } from "@auth0/auth0-react";

export function useUpdateApplicationStatus() {
  const { getAccessTokenSilently } = useAuth0();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ taskId, applicantUsername, status }: {
      taskId: number;
      applicantUsername: string;
      status: 'ACCEPTED' | 'REJECTED';
    }) =>
      updateApplicationStatus(getAccessTokenSilently, taskId, applicantUsername, status),

    onSuccess: (_, { taskId }) => {
      // Invalidate applications query for this task
      qc.invalidateQueries({ queryKey: ["taskApplications", taskId] });
    },
  });
}