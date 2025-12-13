import { useAuth0 } from "@auth0/auth0-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createReview } from "../api/reviewApi";
import type { ReviewRequest } from "../types";

export function useCreateReview() {
  const { getAccessTokenSilently } = useAuth0();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (input: ReviewRequest) => createReview(getAccessTokenSilently, input),
    onSuccess: () => {
      // Invalidate all review queries
      qc.invalidateQueries({ queryKey: ["reviews"] });
    },
  });
}
