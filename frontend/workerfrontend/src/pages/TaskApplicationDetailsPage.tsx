import TaskDetails from "../features/task/components/TaskDetails";
import { getCategoryIcon } from "../utils/generalFunctions";
import { useParams, Link, useLocation } from "react-router-dom";
import { useState } from "react";
import type { ApplicationWithDetails } from "../features/application/types";
import ApplicationForm, {
  type ApplicationFormValues,
} from "../features/application/components/ApplicationForm";
import { useTaskById } from "../features/task/hooks";
import { useUpdateApplication } from "../features/application/hooks/useUpdateApplication";
import { useDeleteApplication } from "../features/application/hooks/useDeleteApplication";
import { useNavigate } from "react-router-dom";

type TabKey = "task" | "application";
type LocationState = { application?: ApplicationWithDetails };

export default function TaskApplicationDetailsPage() {
  const { taskId } = useParams<{ taskId: string }>();
  const navigate = useNavigate();
  const {
    data: task,
    isLoading: taskLoading,
    isError: taskError,
  } = useTaskById(Number(taskId));
  const location = useLocation();
  const passed =
    (location.state as LocationState | undefined)?.application ?? null;

  const [tab, setTab] = useState<TabKey>("task");
  const [application] = useState<ApplicationWithDetails | null>(passed);
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const updateApplication = useUpdateApplication();
  const deleteApplication = useDeleteApplication();

  const handleUpdateApplication = async (values: ApplicationFormValues) => {
    if (!task) return;
    await updateApplication.mutateAsync({
      taskId: task.id,
      payload: values,
    });
  };

  const handleDeleteApplication = async () => {
    if (!task) return;
    const confirmed = window.confirm("Haluatko varmasti poistaa hakemuksen?");
    if (!confirmed) return;

    try {
      await deleteApplication.mutateAsync({ taskId: task.id });
      setFeedback({
        type: "success",
        message: "Hakemus poistettu onnistuneesti",
      });
      setTimeout(() => navigate("/active-applications"), 1500);
    } catch (error) {
      setFeedback({
        type: "error",
        message: error instanceof Error ? error.message : "Poisto epäonnistui",
      });
    }
  };

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="mb-4">
        <Link
          to="/active-applications"
          className="text-sm text-gray-600 hover:text-gray-800"
        >
          ← Takaisin hakemuksiin
        </Link>
      </div>

      {feedback && (
        <div
          className={`mb-4 p-4 rounded-lg ${
            feedback.type === "success"
              ? "bg-green-50 border border-green-200 text-green-700"
              : "bg-red-50 border border-red-200 text-red-700"
          }`}
        >
          {feedback.message}
        </div>
      )}

      <h1 className="text-2xl font-bold text-gray-800 mb-4">{task?.title}</h1>

      <div className="flex mb-6 justify-center">
        <button
          className={`py-2 px-4 text-sm font-medium ${
            tab === "task"
              ? "text-green-600 border-b-2 border-green-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => setTab("task")}
        >
          Tehtävän tiedot
        </button>
        <button
          className={`py-2 px-4 text-sm font-medium ${
            tab === "application"
              ? "text-green-600 border-b-2 border-green-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => setTab("application")}
        >
          Hakemuksen tiedot
        </button>
      </div>
      <>
        {tab === "task" && (
          <>
            {taskLoading && (
              <div className="text-gray-600">Ladataan tehtävää…</div>
            )}
            {taskError && (
              <div className="text-red-600">Tehtävän lataus epäonnistui.</div>
            )}
            {!taskLoading && !taskError && !task && (
              <div className="text-gray-600">Tehtävää ei löytynyt.</div>
            )}
            {!taskLoading && task && (
              <TaskDetails
                task={task}
                description={task.description}
                categories={task.categories}
                getCategoryIcon={getCategoryIcon}
              />
            )}
          </>
        )}

        {tab === "application" && (
          <>
            {!application && (
              <div className="text-gray-600">Hakemuksen tiedot puuttuvat.</div>
            )}
            {application && task && (
              <div className="max-w-4xl mx-auto">
                <ApplicationForm
                  taskPrice={task.price}
                  mode="edit"
                  initialValues={{
                    priceSuggestion: application.priceSuggestion,
                    timeSuggestion: application.timeSuggestion,
                    description: application.description,
                  }}
                  onSubmit={handleUpdateApplication}
                  onSuccess={() => {
                    setFeedback({
                      type: "success",
                      message: "Hakemus päivitetty onnistuneesti!",
                    });
                  }}
                  onCancel={() => navigate("/active-applications")}
                />

                <div className="mt-6 flex justify-center">
                  <button
                    onClick={handleDeleteApplication}
                    disabled={deleteApplication.isPending}
                    className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    <span className="material-icons text-sm">delete</span>
                    {deleteApplication.isPending
                      ? "Poistetaan..."
                      : "Poista hakemus"}
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </>
    </div>
  );
}
