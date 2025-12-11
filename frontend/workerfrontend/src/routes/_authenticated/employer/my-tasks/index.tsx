import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { taskQueries } from "../../../../features/task/queries/taskQueries";
import { useState } from "react";
import { useDeleteTask, useUpdateTaskStatus } from "../../../../features/task/hooks";
import type { Task } from "../../../../features/task";
import { useAuth0 } from "@auth0/auth0-react";
import { useSuspenseQuery } from "@tanstack/react-query";
import EmployerTaskCard from "../../../../features/task/components/EmployerTaskCard";
import ApprovalConfirmModal from "../../../../features/task/components/ApprovalConfirmModal";

export const Route = createFileRoute("/_authenticated/employer/my-tasks/")({
  component: MyTasksPage,
  validateSearch: (search: Record<string, any>) => {
    return {
      tab: (search.tab as string) || "active",
    };
  },
  loaderDeps: ({ search }) => ({ tab: search.tab }),
  loader: async ({ context, deps }) => {
    const status =
      deps.tab === "active"
        ? "ACTIVE"
        : deps.tab === "in-progress"
          ? "IN_PROGRESS"
          : deps.tab === "done"
            ? "COMPLETED"
            : "ACTIVE";

    return context.queryClient.ensureQueryData(
      taskQueries.own(context.auth.getAccessToken, { page: 0, size: 6, status })
    );
  },
});

function MyTasksPage() {
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
          ? "PENDING_APPROVAL"
          : tab === "completed"
            ? "COMPLETED"
            : "ACTIVE";
  const showActions = tab === "active";
  const showApprovalActions = tab === "done";
  const deleteTaskMutation = useDeleteTask();
  const updateStatusMutation = useUpdateTaskStatus();
  const [banner, setBanner] = useState<null | {
    type: "success" | "error";
    message: string;
  }>(null);

  const [confirmModal, setConfirmModal] = useState<null | {
    task: Task;
    action: "approve" | "reject";
  }>(null);

  const { getAccessTokenSilently } = useAuth0();
  const { data } = useSuspenseQuery(
    taskQueries.own(getAccessTokenSilently, {
      page,
      size: pageSize,
      status,
    })
  );

  const tasks = data?.content ?? [];
  const totalPages = data?.totalPages ?? 0;

  const showBanner = (type: "success" | "error", message: string) => {
    setBanner({ type, message });
    window.setTimeout(() => setBanner(null), 6000);
  };

  const handleTabChange = (newTab: "active" | "in-progress" | "done" | "completed") => {
    navigate({
      to: "/employer/my-tasks",
      search: { tab: newTab },
    });
    setPage(0);
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

  const handleApprove = (task: Task) => {
    setConfirmModal({ task, action: "approve" });
  };

  const handleReject = (task: Task) => {
    setConfirmModal({ task, action: "reject" });
  };

  const handleConfirmStatusChange = async () => {
    if (!confirmModal) return;

    const newStatus = confirmModal.action === "approve" ? "COMPLETED" : "IN_PROGRESS";

    try {
      await updateStatusMutation.mutateAsync({
        taskId: confirmModal.task.id,
        status: newStatus,
      });
      showBanner(
        "success",
        confirmModal.action === "approve"
          ? "Työ hyväksyttiin onnistuneesti!"
          : "Työ palautettiin työntekijälle korjattavaksi."
      );
      setConfirmModal(null);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Statuksen päivittäminen epäonnistui.";
      showBanner("error", message);
      setConfirmModal(null);
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

      {/* Tab navigation */}
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

      {/* Tab description */}
      <div className="mb-6 rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700">
        <div className="flex items-start gap-2">
          <span className="material-icons text-base">info</span>
          <div>
            {tab === "active" && (
              <p>
                <strong>Aktiiviset työilmoitukset:</strong> Ilmoitukset joihin työntekijät voivat hakea. Voit muokata
                tai poistaa näitä ilmoituksia.
              </p>
            )}
            {tab === "in-progress" && (
              <p>
                <strong>Käynnissä olevat työt:</strong> Työt joissa työntekijä on aloittanut työn tekemisen. Et voi
                muokata tai poistaa näitä ilmoituksia.
              </p>
            )}
            {tab === "done" && (
              <p>
                <strong>Hyväksyttävät työt:</strong> Työt jotka työntekijä on merkinnyt valmiiksi. Tarkista työn laatu
                ja hyväksy tai hylkää työ.
              </p>
            )}
            {tab === "completed" && (
              <p>
                <strong>Valmiit työt:</strong> Työt jotka olet hyväksynyt valmiiksi. Nämä työt ovat suoritettu loppuun.
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {tasks.map((task: Task) => {
          const isDeleting = deleteTaskMutation.isPending && deleteTaskMutation.variables?.taskId === task.id;
          return (
            <EmployerTaskCard
              key={task.id}
              task={task}
              showActions={showActions}
              showApprovalActions={showApprovalActions}
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
              onApprove={() => handleApprove(task)}
              onReject={() => handleReject(task)}
              isDeleting={isDeleting}
            />
          );
        })}
      </div>

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

      {confirmModal && (
        <ApprovalConfirmModal
          isOpen={!!confirmModal}
          onClose={() => setConfirmModal(null)}
          onConfirm={handleConfirmStatusChange}
          task={confirmModal.task}
          action={confirmModal.action}
          isLoading={updateStatusMutation.isPending}
        />
      )}
    </div>
  );
}
