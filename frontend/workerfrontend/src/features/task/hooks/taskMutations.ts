import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchTaskById, updateTask, createTask, deleteTask, updateApplicationStatus, updateTaskStatus } from "../api/taskApi";
import { useAuth0 } from "@auth0/auth0-react";
import type { CreateTaskInput, DeleteTaskInput, UpdateTaskStatusInput } from "../types";

/**
 * @deprecated Use taskQueries.detail() with useQuery instead
 */
export function useTask(taskId: number | undefined) {
  return useQuery({
    queryKey: taskId !== undefined ? ["tasks", "detail", taskId.toString()] : ["task", taskId],
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
  const { getAccessTokenSilently } = useAuth0();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateTaskInput) =>
      createTask(getAccessTokenSilently, input),
    onSuccess: () => {
      // Invalidate all task queries
      qc.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
}

/** Update an existing task */
export function useUpdateTask(taskId: number) {
  const { getAccessTokenSilently } = useAuth0();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateTaskInput) =>
      updateTask(getAccessTokenSilently, taskId, input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["tasks", "detail", taskId.toString()] });
      qc.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
}

/** Delete a task and clean up related cache entries */
export function useDeleteTask() {
  const { getAccessTokenSilently } = useAuth0();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ taskId }: DeleteTaskInput) =>
      deleteTask(getAccessTokenSilently, taskId),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["tasks", "detail", variables.taskId.toString()],
      });
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["taskApplications"] });
    },
  });
}

/** Update application status (accept/reject) */
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
      qc.invalidateQueries({ queryKey: ["taskApplications"] });
      qc.invalidateQueries({ queryKey: ["tasks", "detail", taskId.toString()] });
      qc.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
}

/** Update task status (e.g., approve/reject work, change to COMPLETED or IN_PROGRESS) */
export function useUpdateTaskStatus() {
  const { getAccessTokenSilently } = useAuth0();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ taskId, status }: UpdateTaskStatusInput) =>
      updateTaskStatus(getAccessTokenSilently, taskId, status),
    onSuccess: (_, { taskId }) => {
      queryClient.invalidateQueries({ queryKey: ["tasks", "detail", taskId.toString()] });
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["taskApplications"] });
    },
  });
}
