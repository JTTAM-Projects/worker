import { canApplyToTask } from "../utils/applyPermisions";

interface TaskApplyButtonActionsProps {
  isAuthenticated: boolean;
  user: any;
  hasApplied: boolean | undefined;
  checkingApplication: boolean;
  showApplicationForm: boolean;
  task: any;
  onApplyClick: () => void;
}

export default function TaskApplyButtonActions({
  isAuthenticated,
  user,
  hasApplied,
  checkingApplication,
  showApplicationForm,
  task,
  onApplyClick,
}: TaskApplyButtonActionsProps) {
  // If the user is authenticated and has already applied
  if (isAuthenticated && hasApplied) {
    return (
      <div className="w-full md:w-[320px] px-6 py-3 bg-gray-200 text-gray-600 font-semibold rounded-lg flex items-center justify-center gap-2 cursor-not-allowed">
        <span className="material-icons">check</span>
        Olet jo hakenut tähän työhön
      </div>
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
      <span className="material-icons">
        {showApplicationForm ? "close" : "check_circle"}
      </span>

      {checkingApplication
        ? "Tarkistetaan..."
        : showApplicationForm
        ? "Sulje lomake"
        : "Hae työhön"}
    </button>
  );
}
