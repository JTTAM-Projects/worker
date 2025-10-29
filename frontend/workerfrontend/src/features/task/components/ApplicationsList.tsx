import { useState } from "react";
import { useTaskApplications } from "../hooks/useTaskApplications";

interface ApplicationsListProps {
  taskId: number;
  pageSize?: number; // Optional, default = 4
}

export default function ApplicationsList({
  taskId,
  pageSize = 4,
}: ApplicationsListProps) {
  const [page, setPage] = useState(0);
  const { data, isLoading, isError } = useTaskApplications(
    taskId,
    page,
    pageSize
  );

  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleDateString("fi-FI", {
      day: "numeric",
      month: "numeric",
      year: "numeric",
    });
  };

  if (isLoading) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <span className="material-icons text-gray-600">people</span>
          Hakemukset
        </h2>
        <div className="text-center text-gray-600 py-8">
          Ladataan hakemuksia...
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <span className="material-icons text-gray-600">people</span>
          Hakemukset
        </h2>
        <div className="text-center text-red-600 py-8">
          Virhe ladattaessa hakemuksia
        </div>
      </div>
    );
  }

  const applications = data?.content || [];

  if (applications.length === 0) {
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

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <span className="material-icons text-gray-600">people</span>
        Hakemukset ({data?.totalElements || 0})
      </h2>

      <div className="space-y-3">
        {applications.map((app, index) => (
          <div
            key={index}
            className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 flex-1">
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                  <span className="material-icons text-gray-600">person</span>
                </div>
                <div>
                  <div className="font-medium text-gray-900">
                    {app.appliedUser.userName}
                  </div>
                  <div className="flex items-center gap-1 text-sm">
                    <span className="material-icons text-yellow-500 text-base">
                      star
                    </span>
                    <span className="text-gray-600">3.7 (5 arvostelua)</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className="text-right">
                  <div className="text-xs text-gray-500 mb-1">
                    Hekemus jätetty
                  </div>
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <span className="material-icons text-gray-500 text-base">
                      event
                    </span>
                    <span>{formatDate(app.createdAt)}</span>
                  </div>
                </div>

                <div className="text-green-600 text-lg font-bold">
                  {app.priceSuggestion} €
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {data && data.totalPages > 1 && (
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
            Sivu {data.number + 1} / {data.totalPages}
          </div>

          <button
            onClick={() => setPage(page + 1)}
            disabled={page >= data.totalPages - 1}
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
