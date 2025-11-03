import TaskDetails from "../features/task/components/TaskDetails";
import ApplicationDetailsModal  from "../features/task/components/ApplicationDetailsModal";
import { fetchApplication } from "../features/application/api/applicationApi";
import { getCategoryIcon } from "../utils/generalFunctions";
import { useParams, Link, useLocation } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import type { ApplicationWithDetails } from "../features/application/types";

type TabKey = "task" | "application";
type LocationState = { application?: ApplicationWithDetails; task?: any };

export default function TaskApplicationDetailsPage() {
  const { taskId } = useParams<{ taskId: string }>();
  const numTaskId = useMemo(() => Number(taskId), [taskId]);
  const { getAccessTokenSilently } = useAuth0();
  const location = useLocation();
  const passed = (location.state as LocationState | undefined)?.application ?? null;

  const [tab, setTab] = useState<TabKey>("task");
  const [application, setApplication] = useState<ApplicationWithDetails | null>(passed);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (application) return;
    let alive = true;
    (async ()=> {
      try {
        setLoading(true);
        const data = await fetchApplication(getAccessTokenSilently, numTaskId);
        if (alive) setApplication(data);
      } catch (e: any) {
        if (alive) setError(e?.message ?? "Virhe haettaessa hakemusta");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [application, getAccessTokenSilently, numTaskId]);

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="mb-4">
        <Link to="/applications" className="text-sm text-gray-600 hover:text-gray-800">
          ← Takaisin hakemuksiin
        </Link>
      </div>

      <h1 className="text-2xl font-bold text-gray-800 mb-4">Hakemus</h1>

      <div className="mb-6 border-b">
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

      {loading && <div className="text-gray-600">Ladataan...</div>}
      {error && <div className="text-red-600">{error}</div>}
      {!loading && !application && !error && (
        <div className="text-gray-600">Hakemusta ei löytynyt tälle tehtävälle.</div>
      )}

      {!loading && application && (
        <>
          {tab === "task" && (
            <TaskDetails
              task={(application as any)?.task ?? (application as any)}
              description={(application as any)?.task?.description ?? (application as any)?.description}
              categories={(application as any)?.task?.categories ?? (application as any)?.categories}
              getCategoryIcon={getCategoryIcon}
            />
          )}

          {tab === "application" && (

          )}
        </>
      )}
    </div>
  );
}