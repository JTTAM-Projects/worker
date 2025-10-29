import { useRef, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { useTaskById } from "../features/task/hooks/useTaskById";
import { getCategoryIcon } from "../features/task/utils/categoryUtils";
import ApplicationsList from "../features/task/components/ApplicationsList";
import TaskDetails from "../features/task/components/TaskDetails";

// Page for viewing and managing own task details
export default function OwnTaskDetailPage() {
  const navigate = useNavigate();
  const { taskId } = useParams<{ taskId: string }>();
  const numericTaskId = taskId ? Number(taskId) : NaN;
  const { data: task, isLoading, isError } = useTaskById(numericTaskId);
  const [activeTab, setActiveTab] = useState("information");
  const { isAuthenticated, loginWithRedirect, isLoading: authLoading } =
    useAuth0();
  const loginAttemptedRef = useRef(false);

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

  return (
    <main className="max-w-7xl mx-auto px-6 py-12">
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
                  <button className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
                    Poista
                  </button>
                </div>
              </>
            ) : (
              <ApplicationsList taskId={task.id} />
            )}
          </div>
        </div>
      )}
    </main>
  );
}
