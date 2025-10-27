import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTaskById } from "../features/task/hooks/useTaskById";
import { getCategoryIcon } from "../features/task/utils/categoryUtils";
import ApplicationsList from "../features/task/components/ApplicationsList";
import TaskDetails from "../features/task/components/TaskDetails";

export default function OwnTaskDetailPage() {
  const navigate = useNavigate();
  const { taskId } = useParams<{ taskId: string }>();
  const { data: task, isLoading, isError } = useTaskById(Number(taskId));
  const [activeTab, setActiveTab] = useState("information");

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
        onClick={() => navigate("/tasks")}
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
                  <button className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 border border-gray-300">
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
