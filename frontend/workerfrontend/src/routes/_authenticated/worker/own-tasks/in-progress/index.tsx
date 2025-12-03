import { useState } from "react";
import { createFileRoute, useNavigate, useSearch } from "@tanstack/react-router";
import { useSuspenseQuery, useQuery } from "@tanstack/react-query";
import { useAuth0 } from "@auth0/auth0-react";
import { taskQueries } from "../../../../../features/task/queries/taskQueries";
import type { TaskFilters, ViewMode } from "../../../../../features/task";
import WorkerTasksToList from "../../../../../features/task/components/WorkerTasksToList";
import { TaskFilterPanel } from "../../../../../features/task/components/TaskFilterPanel";
import { TaskMap } from "../../../../../features/task/components/TaskMap";
import { ResultsControlBar } from "../../../../../features/task/components/ResultsControlBar";
import { useWorkerTaskTabs } from "../workerTaskTabConfig";
import Tabulation from "../../../../../ui-library/Tabulation";

export const Route = createFileRoute("/_authenticated/worker/own-tasks/in-progress/")({
  component: WorkerInProgressTasksPage,
  validateSearch: (search: Record<string, unknown>): { view?: ViewMode } => {
    return {
      view: (search.view as ViewMode) || undefined,
    };
  },
  loader: async ({ context }) => {
    try {
      return await context.queryClient.ensureQueryData(
        taskQueries.worker(context.auth.getAccessToken, {
          page: 0,
          size: 10,
          status: "IN_PROGRESS",
        })
      );
    } catch (error) {
      console.error("Failed to load tasks: ", error);
      // Return empty data on error to prevent crash
      return { context: [], totalPages: 0, number: 0, first: true, last: true };
    }
  },
});

function WorkerInProgressTasksPage() {
  const navigate = useNavigate({ from: "/worker/own-tasks/in-progress" });
  const search = useSearch({ from: "/_authenticated/worker/own-tasks/in-progress/" });
  const { getAccessTokenSilently } = useAuth0();
  const [currentPage, setCurrentPage] = useState(0);
  const pageSize = 10;
  const [filters, setFilters] = useState<TaskFilters>({});
  const viewMode: ViewMode = search.view ?? "list";
  const tabs = useWorkerTaskTabs();

  const { data: taskList } = useSuspenseQuery(
    taskQueries.worker(getAccessTokenSilently, {
      status: "IN_PROGRESS",
      page: currentPage,
      size: pageSize,
      ...filters,
    })
  );

  const { data: tasksOnMap } = useQuery({
    ...taskQueries.worker(getAccessTokenSilently, {
      status: "IN_PROGRESS",
      page: currentPage,
      size: pageSize,
      ...filters,
    }),
    enabled: viewMode === "map", // Only fetch when in map view
  });

  const data = viewMode === "list" ? taskList : tasksOnMap;
  // console.log(taskList); DEBUGGING

  const handleResetFilters = () => {
    setFilters((prev) => ({
      ...prev,
      searchText: undefined,
      categories: undefined,
      minPrice: undefined,
      maxPrice: undefined,
      latitude: undefined,
      longitude: undefined,
      radiusKm: undefined,
      locationText: undefined,
    }));
  };

  // Update filters and reset to page 0
  const updateFilters = (newFilters: TaskFilters) => {
    navigate({
      search: {
        ...search,
        ...newFilters,
      },
    });
  };

  // Update view mode
  const updateViewMode = (newViewMode: ViewMode) => {
    navigate({
      search: {
        ...search,
        view: newViewMode,
      },
    });
  };

  const handlePageChange = (page: number) => setCurrentPage(page);

  return (
    <main className="container mx-auto px-6 py-12 gap-10">
      <div className="flex mt-5 justify-center">
        <Tabulation tabs={tabs} />
      </div>

      <div className="container mx-auto px-6 py-8">
        <TaskFilterPanel
          filters={filters}
          onFiltersChange={(newFilters) => {
            setFilters((prev) => ({
              ...prev,
              ...newFilters,
            }));
            setCurrentPage(0);
          }}
          onReset={handleResetFilters}
        />
        <ResultsControlBar
          totalResults={data?.totalElements}
          filters={filters}
          sortBy={filters.sortBy || "newest"}
          viewMode={viewMode}
          onSortChange={(sort) => updateFilters({ ...filters, sortBy: sort })}
          onViewModeChange={updateViewMode}
          onRemoveFilter={handleResetFilters}
        />
        <div className="flex-1">
          {viewMode === "list" ? (
            <WorkerTasksToList
              tasks={taskList.content}
              totalPages={taskList.totalPages}
              currentPage={taskList.number}
              onPageChange={handlePageChange}
              isFirst={taskList.first}
              isLast={taskList.last}
            />
          ) : (
            <TaskMap
              tasks={tasksOnMap?.content || []}
              totalElements={tasksOnMap?.totalElements || 0}
              filters={filters}
            />
          )}
        </div>
      </div>
    </main>
  );
}
