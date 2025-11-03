import { useRef, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { useTaskById } from "../features/task/hooks/useTaskById";
import { getCategoryIcon } from "../features/task/utils/categoryUtils";
import ApplicationsList from "../features/task/components/ApplicationsList";
import TaskDetails from "../features/task/components/TaskDetails";
import { useUpdateApplicationStatus, useDeleteTask } from "../features/task/hooks";
import ApplicationModal from "../features/task/components/ApplicationDetailsModal";
import type { TaskApplicationDetails } from "../features/task/api/taskApi";

// Page for viewing and managing own task details
export default function OwnTaskDetailPage() {
  const navigate = useNavigate();
  const { taskId } = useParams<{ taskId: string }>();
  const numericTaskId = taskId ? Number(taskId) : NaN;
  const { data: task, isLoading, isError } = useTaskById(numericTaskId);
  const updateApplicationStatus = useUpdateApplicationStatus();
  const lastStatus = updateApplicationStatus.variables?.status;
  const deleteTaskMutation = useDeleteTask();
  const handleUpdateStatus = (status: "ACCEPTED" | "REJECTED") => {
    if (selectedApplication && task) {
      const applicantUsername =
        selectedApplication.user?.userName ??
        selectedApplication.appliedUser.userName;
      updateApplicationStatus.mutate({
        taskId: task.id,
        applicantUsername,
        status,
      });
    }
  };
  const [activeTab, setActiveTab] = useState("information");
  const [selectedApplication, setSelectedApplication] =
    useState<TaskApplicationDetails | null>(null);
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const loginAttemptedRef = useRef(false);
  const {
    isAuthenticated,
    loginWithRedirect,
    isLoading: authLoading,
  } = useAuth0();

  // Close modal and show success message when application status is updated successfully
  useEffect(() => {
    if (!updateApplicationStatus.isSuccess) {
      return;
    }
    setSelectedApplication(null);
    if (lastStatus === "REJECTED") {
      setSuccessMessage("Hakemus hylätty onnistuneesti!");
    } else if (lastStatus === "ACCEPTED") {
      setSuccessMessage("Hakemus hyväksytty onnistuneesti!");
    } else {
      setSuccessMessage("Hakemuksen tila päivitetty.");
    }
    const timeout = window.setTimeout(() => setSuccessMessage(""), 3000);
    return () => window.clearTimeout(timeout);
  }, [lastStatus, updateApplicationStatus.isSuccess]);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated && !loginAttemptedRef.current) {
      loginAttemptedRef.current = true;
      void loginWithRedirect({
        appState: { returnTo: `/my-tasks/${taskId ?? ""}` },
      });
    }

    if (isAuthenticated) {
      loginAttemptedRef.current = false;
    }
  }, [authLoading, isAuthenticated, loginWithRedirect, taskId]);

  if (authLoading || !isAuthenticated) {
    return (
      <main className="container mx-auto px-6 py-12">
        <div className="text-center text-gray-600">
          {authLoading
            ? "Tarkistetaan kirjautumista..."
            : "Uudelleenohjataan kirjautumiseen..."}
        </div>
      </main>
    );
  }

  if (Number.isNaN(numericTaskId)) {
    return (
      <main className="container mx-auto px-6 py-12">
        <div className="text-center text-red-600">
          Virheellinen tehtävän tunniste.
        </div>
        <div className="text-center mt-4">
          <button
            onClick={() => navigate("/my-tasks")}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Palaa omiin työilmoituksiin
          </button>
        </div>
      </main>
    );
  }

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
            onClick={() => navigate("/my-tasks")}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Palaa omiin työilmoituksiin
          </button>
        </div>
      </main>
    );
  }

  const handleDeleteTask = async () => {
    if (!task) {
      return;
    }
    const confirmed = window.confirm(
      "Haluatko varmasti poistaa tämän työilmoituksen?"
    );
    if (!confirmed) {
      return;
    }

    try {
      await deleteTaskMutation.mutateAsync({ taskId: task.id });
      navigate("/my-tasks");
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Työilmoituksen poistaminen epäonnistui.";
      setErrorMessage(message);
      setTimeout(() => setErrorMessage(""), 5000);
    }
  };

  return (
    <main className="max-w-7xl mx-auto px-6 py-12">
      {successMessage && (
        <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
          {successMessage}
        </div>
      )}

      {errorMessage && (
        <div className="mb-6 rounded-lg border border-red-300 bg-red-50 p-4 text-red-700">
          {errorMessage}
        </div>
      )}

      <button
        onClick={() => navigate("/my-tasks")}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6"
      >
        <span className="material-icons">arrow_back</span>
        Takaisin omiin työilmoituksiin
      </button>

      <div className="flex mb-6 border-b">
        <button
          className={`py-2 px-4 text-sm font-medium ${
            activeTab === "information"
              ? "text-green-600 border-b-2 border-green-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => setActiveTab("information")}
        >
          Tiedot
        </button>
        <button
          className={`py-2 px-4 text-sm font-medium ${
            activeTab === "applications"
              ? "text-green-600 border-b-2 border-green-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => setActiveTab("applications")}
        >
          Hakemukset
        </button>
      </div>

      {task && (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="bg-white border-b p-8">
            <h1 className="text-3xl font-bold text-gray-900">{task.title}</h1>
          </div>
          <div className="p-8">
            {activeTab === "information" ? (
              <>
                <TaskDetails
                  task={task}
                  description={task.description}
                  categories={task.categories}
                  getCategoryIcon={getCategoryIcon}
                />
                <div className="mt-6 flex gap-4 justify-end">
                  <button
                    onClick={() => {
                      if (authLoading) {
                        return;
                      }
                      if (!isAuthenticated) {
                        void loginWithRedirect({
                          appState: { returnTo: `/edit-task/${task.id}` },
                        });
                        return;
                      }
                      navigate(`/edit-task/${task.id}`);
                    }}
                    className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 border border-gray-300"
                  >
                    Muokkaa
                  </button>
                  <button
                    onClick={handleDeleteTask}
                    disabled={deleteTaskMutation.isPending}
                    className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {deleteTaskMutation.isPending ? "Poistetaan..." : "Poista"}
                  </button>
                </div>
              </>
            ) : (
              <>
                <ApplicationsList
                  taskId={task.id}
                  onSelect={setSelectedApplication}
                />
                {selectedApplication && (
                  <ApplicationModal
                    application={selectedApplication}
                    onClose={() => setSelectedApplication(null)}
                    onUpdateStatus={(status) => handleUpdateStatus(status)}
                  />
                )}
              </>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
