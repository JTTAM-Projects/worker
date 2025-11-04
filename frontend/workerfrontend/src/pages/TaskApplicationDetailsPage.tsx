import TaskDetails from "../features/task/components/TaskDetails";
import { fetchApplication } from "../features/application/api/applicationApi";
import { getCategoryIcon } from "../utils/generalFunctions";
import { useParams, Link, useLocation } from "react-router-dom";
import { useState } from "react";
import type { ApplicationWithDetails } from "../features/application/types";
import ApplicationEditForm from "../features/application/components/ApplicationEditForm";
import { useTaskById } from "../features/task/hooks";

type TabKey = "task" | "application";
type LocationState = { application?: ApplicationWithDetails };

export default function TaskApplicationDetailsPage() {
  const { taskId } = useParams<{ taskId: string }>();
  const { data: task, isLoading: taskLoading, isError: taskError } = useTaskById(Number(taskId));
  const location = useLocation();
  const passed = (location.state as LocationState | undefined)?.application ?? null;

  const [tab, setTab] = useState<TabKey>("task");
  const [application, setApplication] = useState<ApplicationWithDetails | null>(passed);

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="mb-4">
        <Link to="/active-applications" className="text-sm text-gray-600 hover:text-gray-800">
          ← Takaisin hakemuksiin
        </Link>
      </div>

      <h1 className="text-2xl font-bold text-gray-800 mb-4">{task?.title}</h1>

      <div className="flex mb-6 justify-center">
        <button
          className={`py-2 px-4 text-sm font-medium ${
            tab === "task" ? "text-green-600 border-b-2 border-green-600" : "text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => setTab("task")}
        >
          Tehtävän tiedot
        </button>
        <button
          className={`py-2 px-4 text-sm font-medium ${
            tab === "application" ? "text-green-600 border-b-2 border-green-600" : "text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => setTab("application")}
        >
          Hakemuksen tiedot
        </button>
      </div>
        <>
          {tab === "task" && (
            <>
              {taskLoading && <div className="text-gray-600">Ladataan tehtävää…</div>}
              {taskError && <div className="text-red-600">Tehtävän lataus epäonnistui.</div>}
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
              {application && (
                <ApplicationEditForm
                  application={application}
                  onSave={async () => {}}
                  onDelete={async () => {}}
                />
              )}
            </>
          )}
        </>
    </div>
  );
}