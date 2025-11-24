import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useAuth0 } from "@auth0/auth0-react";
import { taskQueries } from "../../../../../features/task/queries/taskQueries";
import type { TaskFilters } from "../../../../../features/task";
import WorkerTasksToList from "../../../../../features/task/components/WorkerTasksToList";
import { TaskFilterPanel } from "../../../../../features/task/components/TaskFilterPanel";

export const Route = createFileRoute("/_authenticated/worker/own-tasks/waiting-approval/")({
  component: WorkerWaitingApprovalTasksPage,
  loader: async ({ context }) => {
    try {
      return await context.queryClient.ensureQueryData(
        taskQueries.worker(context.auth.getAccessToken, {
          page: 0,
          size: 10,
          status: "PENDING_APPROVAL",
        })
      );
    } catch (error) {
      console.error('Failed to load tasks: ', error);
      // Return empty data on error to prevent crash    
      return { context: [], totalPages: 0, number: 0, first: true, last: true };
    }
  }
});

function WorkerWaitingApprovalTasksPage() {
  const navigate = useNavigate();
  const { getAccessTokenSilently } = useAuth0();
  const [currentPage, setCurrentPage] = useState(0);
  const pageSize = 10;
  const [filters, setFilters] = useState<TaskFilters>({})

  const { data: taskList } = useSuspenseQuery(
    taskQueries.worker(getAccessTokenSilently, {
      status: "PENDING_APPROVAL",
      page: currentPage,
      size: pageSize,
      ...filters,
    })
  );

  const handleResetFilters = () => {
    setFilters((prev) => ({
      ...prev,
      searchText: undefined,
      categories: undefined,
      minPrice: undefined,
      maxPrice: undefined,
    }));
  };

  const handlePageChange = (page: number) => setCurrentPage(page);

  return (
    <main className="container mx-auto px-6 py-12 gap-10">
      <div className="flex mt-5 justify-center">
        <button
          className={"py-2 px-4 text-sm font-medium text-gray-500 hover:text-gray-700"}
          onClick={() => navigate({ to: "/worker/own-tasks/to-do" })}
        >
          Aktiiviset
        </button>
        <button
          className={"py-2 px-4 text-sm font-medium text-gray-500 hover:text-gray-700"}
          onClick={() => navigate({ to: "/worker/own-tasks/in-progress" })}
        >
          Työn alla
        </button>
        <button
          className={"py-2 px-4 text-sm font-medium text-green-600 border-b-2 border-green-600"}
          onClick={() => navigate({ to: "/worker/own-tasks/waiting-approval" })}
        >
          Odottaa hyväksyntää
        </button>
        <button
          className={"py-2 px-4 text-sm font-medium text-gray-500 hover:text-gray-700"}
          onClick={() => navigate({ to: "/worker/own-tasks/past" })}
        >
          Menneet
        </button>
      </div>

      <div className="container mx-auto px-6 py-8">    
          <TaskFilterPanel
            filters={filters}
            onFiltersChange={(newFilters) => {
              setFilters((prev) => ({
                ...prev,
                ...newFilters
              }));
              setCurrentPage(0);
            }}
            onReset={handleResetFilters}
          />
        <div className="flex-1">
          <WorkerTasksToList 
            tasks={taskList.content}
            totalPages={taskList.totalPages}
            currentPage={taskList.number}
            onPageChange={handlePageChange}
            isFirst={taskList.first}
            isLast={taskList.last} 
          />
        </div>
      </div>
    </main>
  );
}
