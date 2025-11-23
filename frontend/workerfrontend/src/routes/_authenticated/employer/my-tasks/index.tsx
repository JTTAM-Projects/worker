import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useDeleteTask } from "../../../../features/task/hooks";
import { useAuth } from "../../../../auth/useAuth";
import { taskQueries } from "../../../../features/task/queries/taskQueries";
import { useSuspenseQuery } from "@tanstack/react-query";
import type { Task } from "../../../../features/task/types";
import { useState } from "react";

export const Route = createFileRoute("/_authenticated/employer/my-tasks/")({
  component: MyTasksPage,
  loader: async ({ context }) => {
    return context.queryClient.ensureQueryData(taskQueries.own(context.auth.getAccessToken, { page: 0, size: 5 }));
  },
});

function MyTasksPage() {
  const navigate = useNavigate();
  const { getAccessTokenSilently } = useAuth();
  const [page, setPage] = useState(0);
  const pageSize = 5;
  const deleteTaskMutation = useDeleteTask();
  const [banner, setBanner] = useState<null | {
    type: "success" | "error";
    message: string;
  }>(null);

  const { data } = useSuspenseQuery(taskQueries.own(getAccessTokenSilently, { page: page, size: pageSize }));

  const tasks = data?.content ?? [];
  const totalPages = data?.totalPages ?? 0;

  const showBanner = (type: "success" | "error", message: string) => {
    setBanner({ type, message });
    window.setTimeout(() => setBanner(null), 6000);
  };

  const handleDelete = async (task: Task) => {
    const confirmed = window.confirm(`Haluatko varmasti poistaa työilmoituksen "${task.title}"?`);
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
      const message = error instanceof Error ? error.message : "Työilmoituksen poistaminen epäonnistui.";
      showBanner("error", message);
    }
  };

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-800">Omat työilmoitukset</h1>
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
            <span className="material-icons">{banner.type === "success" ? "check_circle" : "error"}</span>
            <span className="font-semibold">{banner.message}</span>
          </div>
        </div>
      )}

      {tasks.length === 0 && (
        <div className="rounded-lg border border-dashed border-gray-300 bg-white p-10 text-center text-gray-500">
          Sinulla ei ole vielä työilmoituksia. Luo ensimmäinen ilmoitus painamalla "Uusi ilmoitus" -painiketta.
        </div>
      )}

      {tasks.length > 0 && (
        <div className="space-y-4">
          {tasks.map((task) => {
            const isDeleting = deleteTaskMutation.isPending && deleteTaskMutation.variables?.taskId === task.id;
            return (
              <TaskCard
                key={task.id}
                task={task}
                onView={() =>
                  navigate({ to: "/employer/my-tasks/$taskId/details", params: { taskId: task.id.toString() } })
                }
                onEdit={() =>
                  navigate({ to: "/employer/my-tasks/$taskId/details/edit", params: { taskId: task.id.toString() } })
                }
                onDelete={() => handleDelete(task)}
                isDeleting={isDeleting}
              />
            );
          })}
        </div>
      )}

      {totalPages > 1 && (
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
            onClick={() => setPage((prev) => Math.min(prev + 1, totalPages - 1))}
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

interface TaskCardProps {
  task: Task;
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
  isDeleting: boolean;
}

function TaskCard({ task, onView, onEdit, onDelete, isDeleting }: TaskCardProps) {
  const status = getStatusDisplay(task.status);

  const formatDate = (value: string) => {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      return value;
    }
    return date.toLocaleDateString("fi-FI", {
      day: "numeric",
      month: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-semibold text-gray-900">{task.title}</h2>
            <span
              className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium ${status.className}`}
            >
              {status.label}
            </span>
          </div>

          <div className="mt-3 grid gap-4 text-sm text-gray-600 md:grid-cols-3">
            <div className="flex items-center gap-2">
              <span className="material-icons text-base text-green-500">event</span>
              <span>
                {formatDate(task.startDate)} – {formatDate(task.endDate)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="material-icons text-base text-green-500">place</span>
              <span>{task.locations?.[0]?.city ?? "Ei sijaintia"}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="material-icons text-base text-green-500">euro</span>
              <span>{task.price} €</span>
            </div>
          </div>

          {task.description && <p className="mt-3 line-clamp-2 text-gray-700">{task.description}</p>}
        </div>

        <div className="flex flex-shrink-0 flex-col gap-2">
          <button
            onClick={onView}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Näytä
          </button>
          <button
            onClick={onEdit}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Muokkaa
          </button>
          <button
            onClick={onDelete}
            disabled={isDeleting}
            className="rounded-lg border border-red-300 bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isDeleting ? "Poistetaan..." : "Poista"}
          </button>
        </div>
      </div>
    </div>
  );
}

function getStatusDisplay(status: Task["status"]) {
  switch (status) {
    case "ACTIVE":
      return {
        label: "Aktiivinen",
        className: "border-green-300 bg-green-100 text-green-700",
      };
    case "IN_PROGRESS":
      return {
        label: "Käynnissä",
        className: "border-blue-300 bg-blue-100 text-blue-700",
      };
    case "COMPLETED":
      return {
        label: "Valmistunut",
        className: "border-gray-300 bg-gray-100 text-gray-700",
      };
    case "CANCELLED":
      return {
        label: "Peruttu",
        className: "border-red-300 bg-red-100 text-red-700",
      };
    case "EXPIRED":
      return {
        label: "Vanhentunut",
        className: "border-yellow-300 bg-yellow-100 text-yellow-700",
      };
    default:
      return {
        label: status,
        className: "border-gray-300 bg-gray-100 text-gray-700",
      };
  }
}
