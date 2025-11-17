import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Route } from "../routes/_authenticated/employer/my-tasks/index";
import { useUserTasks } from "../features/task/hooks/useUserTasks";
import { useDeleteTask } from "../features/task/hooks/useDeleteTask";
import type { Task } from "../features/task/types";
import TaskCard from "../features/task/components/TaskCard";

export default function MyTasksPage() {
  const navigate = useNavigate();
  const { tab = "active" } = Route.useSearch();

  const [page, setPage] = useState(0);
  const pageSize = 6;

  const status =
    tab === "active"
      ? "ACTIVE"
      : tab === "in-progress"
        ? "IN_PROGRESS"
        : tab === "done" // Waiting for employers acceptance
          ? "IN_PROGRESS"
          : tab === "completed"
            ? "COMPLETED"
            : "ACTIVE";
  const showActions = tab === "active";
  const deleteTaskMutation = useDeleteTask();
  const [banner, setBanner] = useState<null | {
    type: "success" | "error";
    message: string;
  }>(null);

  const { data, isLoading, isError } = useUserTasks({
    page,
    size: pageSize,
    status,
  });

  const tasks = data?.content ?? [];
  const totalPages = data?.totalPages ?? 0;

  const showBanner = (type: "success" | "error", message: string) => {
    setBanner({ type, message });
    window.setTimeout(() => setBanner(null), 6000);
  };

  const handleTabChange = (
    newTab: "active" | "in-progress" | "done" | "completed"
  ) => {
    navigate({
      to: "/employer/my-tasks",
      search: { tab: newTab },
    });
    setPage(0);
  };

  const handleDelete = async (task: Task) => {
    const confirmed = window.confirm(
      `Haluatko varmasti poistaa työilmoituksen "${task.title}"?`
    );
    if (!confirmed) {
      return;
    }

    try {
      await deleteTaskMutation.mutateAsync({ taskId: task.id });
      showBanner("success", "Työilmoitus poistettiin onnistuneesti.");
      if (tasks.length === 1 && page > 0) {
        setPage((prev) => Math.max(prev - 1, 0));
      }
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Työilmoituksen poistaminen epäonnistui.";
      showBanner("error", message);
    }
  };

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-800">
          Omat työilmoitukset
        </h1>
        <button
          onClick={() => navigate({ to: "/employer/create-task" })}
          className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 font-semibold text-white hover:bg-green-700"
        >
          <span className="material-icons text-base">add</span>
          Uusi ilmoitus
        </button>
      </div>
      {banner && (
        <div
          className={`mb-6 rounded-lg border px-4 py-4 text-sm ${
            banner.type === "success"
              ? "border-green-200 bg-green-50 text-green-800"
              : "border-red-200 bg-red-50 text-red-700"
          }`}
        >
          <div className="flex items-center gap-3">
            <span className="material-icons">
              {banner.type === "success" ? "check_circle" : "error"}
            </span>
            <span className="font-semibold">{banner.message}</span>
          </div>
        </div>
      )}

      <div className="mb-6 border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => handleTabChange("active")}
            className={`whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium transition-colors ${
              tab === "active"
                ? "border-green-500 text-green-600"
                : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
            }`}
          >
            <span className="flex items-center gap-2">
              <span className="material-icons text-base">assignment</span>
              Aktiiviset
            </span>
          </button>
          <button
            onClick={() => handleTabChange("in-progress")}
            className={`whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium transition-colors ${
              tab === "in-progress"
                ? "border-green-500 text-green-600"
                : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
            }`}
          >
            <span className="flex items-center gap-2">
              <span className="material-icons text-base">work_history</span>
              Käynnissä
            </span>
          </button>
          <button
            onClick={() => handleTabChange("done")}
            className={`whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium transition-colors ${
              tab === "done"
                ? "border-green-500 text-green-600"
                : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
            }`}
          >
            <span className="flex items-center gap-2">
              <span className="material-icons text-base">rate_review</span>
              Hyväksyttävät
            </span>
          </button>

          <button
            onClick={() => handleTabChange("completed")}
            className={`whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium transition-colors ${
              tab === "completed"
                ? "border-green-500 text-green-600"
                : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
            }`}
          >
            <span className="flex items-center gap-2">
              <span className="material-icons text-base">task_alt</span>
              Valmiit
            </span>
          </button>
        </nav>
      </div>
      {isLoading && (
        <div className="rounded-lg border border-gray-200 bg-white p-6 text-center text-gray-600 shadow-sm">
          Ladataan ilmoituksia...
        </div>
      )}
      {isError && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center text-red-700 shadow-sm">
          Ilmoitusten lataaminen epäonnistui.
        </div>
      )}
      {!isLoading && !isError && tasks.length === 0 && (
        <div className="rounded-lg border border-dashed border-gray-300 bg-white p-10 text-center text-gray-500">
          Sinulla ei ole vielä työilmoituksia. Luo ensimmäinen ilmoitus
          painamalla "Uusi ilmoitus" -painiketta.
        </div>
      )}
      {!isLoading && !isError && tasks.length > 0 && (
        <div className="space-y-4">
          {tasks.map((task) => {
            const isDeleting =
              deleteTaskMutation.isPending &&
              deleteTaskMutation.variables?.taskId === task.id;
            return (
              <TaskCard
                key={task.id}
                task={task}
                showActions={showActions}
                onView={() =>
                  navigate({
                    to: "/employer/my-tasks/$taskId/details",
                    params: { taskId: task.id.toString() },
                  })
                }
                onEdit={() =>
                  navigate({
                    to: "/employer/my-tasks/$taskId/details/edit",
                    params: { taskId: task.id.toString() },
                  })
                }
                onDelete={() => handleDelete(task)}
                isDeleting={isDeleting}
              />
            );
          })}
        </div>
      )}
      {!isLoading && !isError && totalPages > 1 && (
        <div className="mt-8 flex items-center justify-between">
          <button
            onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
            disabled={page === 0}
            className="flex items-center gap-1 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <span className="material-icons text-sm">chevron_left</span>
            Edellinen
          </button>

          <div className="text-sm text-gray-600">
            Sivu {page + 1} / {totalPages}
          </div>

          <button
            onClick={() =>
              setPage((prev) => Math.min(prev + 1, totalPages - 1))
            }
            disabled={page >= totalPages - 1}
            className="flex items-center gap-1 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Seuraava
            <span className="material-icons text-sm">chevron_right</span>
          </button>
        </div>
      )}
    </div>
  );
}
