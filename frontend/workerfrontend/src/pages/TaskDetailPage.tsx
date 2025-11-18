import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import { useTaskById } from "../features/task/hooks";
import { getCategoryIcon } from "../features/task/utils/categoryUtils";
import TaskDetails from "../features/task/components/TaskDetails";
import UserApplicationSection from "../features/application/components/UserApplicationSection";

export default function TaskDetailPage() {
  const navigate = useNavigate();
  const { taskId } = useParams<{ taskId: string }>();
  const location = useLocation();
  const [feedback, setFeedback] = useState<null | {
    type: "success" | "error";
    message: string;
  }>(null);

  //Conditional return based on which page user came to TaskDetailPage: ActiveApplicationsPage / TaskPage
  const cameFromApplications =
    (location.state as { from?: string } | null)?.from === "applications";
  const browseHistory = cameFromApplications
    ? "/active-applications"
    : "/tasks";
  const canGoBack = (window.history?.state?.idx ?? 0) > 0;
  const goBack = () => (canGoBack ? navigate(-1) : navigate(browseHistory));

  const { data: task, isLoading, isError } = useTaskById(Number(taskId));

  const showFeedback = (type: "success" | "error", message: string) => {
    setFeedback({ type, message });
    window.setTimeout(() => setFeedback(null), 8000);
  };

  if (isLoading) {
    return (
      <main className="container mx-auto px-6 py-12">
        <div className="text-center text-gray-600">Ladataan tehtävää...</div>
      </main>
    );
  }

  if (isError || !task) {
    return (
      <main className="container mx-auto px-6 py-12">
        <div className="text-center text-red-600">
          Virhe ladattaessa tehtävää: {"Tehtävää ei löytynyt"}
        </div>
        <div className="text-center mt-4">
          <button
            onClick={goBack}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Palaa takaisin
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-6 py-12">
      {feedback && (
        <div
          className={`mb-6 rounded-lg border px-4 py-4 text-sm ${
            feedback.type === "success"
              ? "border-green-200 bg-green-50 text-green-800"
              : "border-red-200 bg-red-50 text-red-700"
          }`}
        >
          <div className="flex items-center gap-3">
            <span className="material-icons">
              {feedback.type === "success" ? "check_circle" : "error"}
            </span>
            <span className="font-semibold">{feedback.message}</span>
          </div>
        </div>
      )}

      <button
        onClick={goBack}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6"
      >
        <span className="material-icons">arrow_back</span>
        Palaa Takaisin
      </button>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-white border-b p-8">
          <h1 className="text-3xl font-bold text-gray-900">{task.title}</h1>
        </div>

        <div className="p-8">
          <TaskDetails
            task={task}
            description={task.description}
            categories={task.categories}
            getCategoryIcon={getCategoryIcon}
          />

          <UserApplicationSection task={task} onFeedback={showFeedback} />
        </div>
      </div>
    </main>
  );
}
