import { canApplyToTask } from "../utils/applyPermisions";
import type { Task } from "../../task/types";

type AuthUser = { sub?: string } | undefined;

interface TaskApplyButtonActionsProps {
  isAuthenticated: boolean;
  user: AuthUser;
  hasApplied: boolean | undefined;
  checkingApplication: boolean;
  showApplicationForm: boolean;
  task: Task;
  onApplyClick: () => void;
}

// Renders the appropriate action button based on authentication status, application state, and user permissions.
// Shows "Edit Application" if already applied, "Apply" if eligible, or nothing if user owns the task.
export default function TaskApplyButtonActions({
  isAuthenticated,
  user,
  hasApplied,
  checkingApplication,
  showApplicationForm,
  task,
  onApplyClick,
}: TaskApplyButtonActionsProps) {
  if (isAuthenticated && hasApplied) {
    return (
      <button
        onClick={onApplyClick}
        disabled={checkingApplication}
        className="w-full md:w-[320px] px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span className="material-icons">{showApplicationForm ? "close" : "edit"}</span>
        {checkingApplication ? "Tarkistetaan..." : showApplicationForm ? "Sulje lomake" : "Muokkaa hakemusta"}
      </button>
    );
  }

  // If the user is authenticated but cant apply to the task
  if (isAuthenticated && user && !canApplyToTask(user, task)) {
    return null;
  }

  // If the user is authenticated or can apply to the task
  return (
    <button
      onClick={onApplyClick}
      disabled={checkingApplication}
      className="w-full md:w-[320px] px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <span className="material-icons">{showApplicationForm ? "close" : "check_circle"}</span>

      {checkingApplication ? "Tarkistetaan..." : showApplicationForm ? "Sulje lomake" : "Hae työhön"}
    </button>
  );
}
