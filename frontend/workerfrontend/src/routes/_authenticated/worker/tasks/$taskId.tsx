import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { taskQueries } from "../../../../features/task/queries/taskQueries";
import { useSuspenseQuery } from "@tanstack/react-query";
import { getCategoryIcon } from "../../../../features/task/utils/categoryUtils";
import TaskDetails from "../../../../features/task/components/TaskDetails";
import UserApplicationSection from "../../../../features/application/components/UserApplicationSection";
import ApplicationsList from "../../../../features/application/components/ApplicationsList";
import { Outlet } from "react-router-dom";

export const Route = createFileRoute("/_authenticated/worker/tasks/$taskId")({
  loader: ({ context: { queryClient }, params: { taskId } }) => {
    return (
      queryClient.ensureQueryData(taskQueries.detail(taskId)),
      queryClient.ensureQueryData(taskQueries.applications(parseInt(taskId)))
    );
  },
  component: TaskDetailPage,
});

function TaskDetailPage() {
  const [feedback, setFeedback] = useState<null | {
    type: "success" | "error";
    message: string;
  }>(null);

  const taskId = Route.useParams().taskId;
  const { data: task } = useSuspenseQuery(taskQueries.detail(taskId));
  const { data: applications } = useSuspenseQuery(taskQueries.applications(parseInt(taskId)));

  // Get saved search params for back navigation
  const getSavedTasksSearch = () => {
    try {
      const saved = sessionStorage.getItem('worker-tasks-search');
      return saved ? JSON.parse(saved) : undefined;
    } catch {
      return undefined;
    }
  };

  const showFeedback = (type: "success" | "error", message: string) => {
    setFeedback({ type, message });
    window.setTimeout(() => setFeedback(null), 8000);
  };

  return (
    <main className="max-w-7xl mx-auto px-6 py-12">
      {/* Back Button */}
      <Link
        to="/worker/tasks"
        search={getSavedTasksSearch()}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6 transition-colors"
      >
        <span className="material-icons">arrow_back</span>
        <span className="font-medium">Takaisin työilmoituksiin</span>
      </Link>

      {feedback && (
        <div
          className={`mb-6 rounded-lg border px-4 py-4 text-sm ${
            feedback.type === "success"
              ? "border-green-200 bg-green-50 text-green-800"
              : "border-red-200 bg-red-50 text-red-700"
          }`}
        >
          <div className="flex items-center gap-3">
            <span className="material-icons">{feedback.type === "success" ? "check_circle" : "error"}</span>
            <span className="font-semibold">{feedback.message}</span>
          </div>
        </div>
      )}

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

      <Outlet />

      <div className="mt-8">
        <ApplicationsList applications={applications} taskId={taskId} />
      </div>
    </main>
  );
}
