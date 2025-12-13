import type { Task } from "../../task/types";

type AuthUser = { sub?: string } | null | undefined;

export function canApplyToTask(user: AuthUser, task: Pick<Task, "user"> | null | undefined): boolean {
  if (!user || !task) return false;
  // Block application if the user is the task creator
  if (user.sub === task.user.userName) return false;
  return true;
}
