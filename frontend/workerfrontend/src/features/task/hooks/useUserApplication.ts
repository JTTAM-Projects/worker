import { useQuery } from "@tanstack/react-query";
import { useAuth0 } from "@auth0/auth0-react";
import { checkUserApplication } from "../api/taskApi";

export function useUserApplication(taskId: number) {
  const { isAuthenticated, getAccessTokenSilently } = useAuth0();

  return useQuery({
    queryKey: ["userApplication", taskId],
    queryFn: () => checkUserApplication(getAccessTokenSilently, taskId),
    enabled: isAuthenticated && !!taskId,
    staleTime: 30 * 1000, // 30 seconds
    retry: false, 
  });
}
