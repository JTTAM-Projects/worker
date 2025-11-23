import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchTaskById, updateTask, createTask, deleteTask, updateApplicationStatus } from "../api/taskApi";
import type { CreateTaskInput } from "../api/taskApi.types";
import { useAuth } from "../../../auth/useAuth";
import { taskQueryKeys } from "./taskQueryKeys";

/**
 * @deprecated Use useTaskById from useTasks.ts instead
 */
export function useTask(taskId: number | undefined) {
  return useQuery({
    queryKey: taskId !== undefined ? taskQueryKeys.detail(taskId) : ["task", taskId],
    queryFn: () => {
      if (taskId === undefined) {
        throw new Error("taskId puuttuu");
      }
      return fetchTaskById(taskId);
    },
    enabled: taskId !== undefined,
  });
}

/** Create a new task */
export function useCreateTask() {
  const { getAccessTokenSilently } = useAuth();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateTaskInput) =>
      createTask(getAccessTokenSilently, input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: taskQueryKeys.lists() });
      qc.invalidateQueries({ queryKey: taskQueryKeys.userLists() });
    },
  });
}

/** Update an existing task */
export function useUpdateTask(taskId: number) {
  const { getAccessTokenSilently } = useAuth();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateTaskInput) =>
      updateTask(getAccessTokenSilently, taskId, input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: taskQueryKeys.detail(taskId) });
      qc.invalidateQueries({ queryKey: taskQueryKeys.lists() });
      qc.invalidateQueries({ queryKey: taskQueryKeys.userLists() });
    },
  });
}

export interface DeleteTaskInput {
  taskId: number;
}

/** Delete a task and clean up related cache entries */
export function useDeleteTask() {
  const { getAccessTokenSilently } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ taskId }: DeleteTaskInput) =>
      deleteTask(getAccessTokenSilently, taskId),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: taskQueryKeys.detail(variables.taskId),
      });
      queryClient.invalidateQueries({ queryKey: taskQueryKeys.lists() });
      queryClient.invalidateQueries({ queryKey: taskQueryKeys.userLists() });
      queryClient.invalidateQueries({
        queryKey: taskQueryKeys.applicationLists(),
      });
    },
  });
}

/** Update application status (accept/reject) */
export function useUpdateApplicationStatus() {
  const { getAccessTokenSilently } = useAuth();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ taskId, applicantUsername, status }: {
      taskId: number;
      applicantUsername: string;
      status: 'ACCEPTED' | 'REJECTED';
    }) =>
      updateApplicationStatus(getAccessTokenSilently, taskId, applicantUsername, status),
    onSuccess: (_, { taskId }) => {
      qc.invalidateQueries({ queryKey: taskQueryKeys.applicationLists() });
      qc.invalidateQueries({ queryKey: taskQueryKeys.detail(taskId) });
      qc.invalidateQueries({ queryKey: taskQueryKeys.lists() });
      qc.invalidateQueries({ queryKey: taskQueryKeys.userLists() });
    },
  });
}
