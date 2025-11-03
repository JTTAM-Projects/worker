
export function canApplyToTask(user: any, task: any): boolean {
  if (!user || !task) return false;
  // Block application if the user is the task creator
  if (user.sub === task.user.userName) return false;
  return true;
}