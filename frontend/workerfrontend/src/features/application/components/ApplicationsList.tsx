import { useState } from "react";
import { useAuth } from "../../../auth/useAuth";
import { fetchApplicationDetails, type TaskApplicationDetails } from "../../task/api/taskApi";
import type { PaginatedResponse, TaskApplicant } from "../../task/types";

interface ApplicationsListProps {
  applications: PaginatedResponse<TaskApplicant>;
  taskId: string;
  pageSize?: number; // Optional, default = 4
  onSelect?: (application: TaskApplicationDetails) => void;
}

// Displays paginated list of PENDING applications for a task owner to review.
// Fetches applications via useTaskApplications hook and allows selection to view details in a modal.
export default function ApplicationsList({ applications, taskId, onSelect }: ApplicationsListProps) {
  const { getAccessTokenSilently } = useAuth();
  const [page, setPage] = useState(0);

  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleDateString("fi-FI", {
      day: "numeric",
      month: "numeric",
      year: "numeric",
    });
  };

  //Filter to show only active (PENDING) applications
  const filteredApplications = (applications?.content || []).filter(
    (app: TaskApplicant) => app.applicationStatus === "PENDING"
  );

  if (filteredApplications.length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <span className="material-icons text-gray-600">people</span>
          Hakemukset
        </h2>
        <div className="text-center text-gray-500 py-8">
          Ei vielä hakemuksia. Ole ensimmäinen joka hakee tähän tehtävään!
        </div>
      </div>
    );
  }

  async function handleSelect(app: TaskApplicant) {
    try {
      const token = await getAccessTokenSilently();
      const details = await fetchApplicationDetails(parseInt(taskId), app.appliedUser.userName, token);
      onSelect?.({ ...app, ...details, user: details.user ?? app.appliedUser });
    } catch {
      onSelect?.({ ...app, user: app.appliedUser });
    }
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <span className="material-icons text-gray-600">people</span>
        Hakemukset ({applications?.totalElements || 0})
      </h2>

      <div className="space-y-3">
        {filteredApplications.map((app: TaskApplicant, index: number) => (
          <div
            key={`${app.appliedUser.userName}-${index}`}
            onClick={() => handleSelect(app)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") handleSelect(app);
            }}
            className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 flex-1">
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                  <span className="material-icons text-gray-600">person</span>
                </div>
                <div>
                  <div className="font-medium text-gray-900">{app.appliedUser.userName}</div>
                  <div className="flex items-center gap-1 text-sm">
                    <span className="material-icons text-yellow-500 text-base">star</span>
                    <span className="text-gray-600">Ei arvosteluja</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className="text-right">
                  <div className="text-xs text-gray-500 mb-1">Hekemus jätetty</div>
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <span className="material-icons text-gray-500 text-base">event</span>
                    <span>{formatDate(app.createdAt)}</span>
                  </div>
                  <div className="mt-1">
                    {app.applicationStatus === "PENDING" ? (
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 border border-green-300">
                        Aktiivinen
                      </span>
                    ) : app.applicationStatus === "ACCEPTED" ? (
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700 border border-blue-300">
                        Hyväksytty
                      </span>
                    ) : app.applicationStatus === "REJECTED" ? (
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700 border border-red-300">
                        Hylätty
                      </span>
                    ) : (
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 border border-gray-300">
                        {app.applicationStatus}
                      </span>
                    )}
                  </div>
                </div>

                <div className="text-green-600 text-lg font-bold">{app.priceSuggestion} €</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Application detail modal is handled by parent via onSelect */}
      {applications && applications.totalPages > 1 && (
        <div className="mt-6 flex items-center justify-between">
          <button
            onClick={() => setPage(page - 1)}
            disabled={page === 0}
            className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white transition-colors"
          >
            <span className="material-icons text-sm">chevron_left</span>
            Edellinen
          </button>

          <div className="text-sm text-gray-600">
            Sivu {applications.number + 1} / {applications.totalPages}
          </div>

          <button
            onClick={() => setPage(page + 1)}
            disabled={page >= applications.totalPages - 1}
            className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white transition-colors"
          >
            Seuraava
            <span className="material-icons text-sm">chevron_right</span>
          </button>
        </div>
      )}
    </div>
  );
}
