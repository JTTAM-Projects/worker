import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { taskQueries } from "../../../../../../features/task/queries/taskQueries";
import { useDeleteTask } from "../../../../../../features/task/hooks";
import { useState } from "react";
import TaskDetails from "../../../../../../features/task/components/TaskDetails";
import { getCategoryIcon } from "../../../../../../features/task/utils/categoryUtils";
import { Button } from "@headlessui/react";

export const Route = createFileRoute("/_authenticated/employer/my-tasks/$taskId/details/")({
  component: OwnTaskDetailPage,
  loader: async ({ context, params }) => {
    return context.queryClient.ensureQueryData(taskQueries.detail(params.taskId));
  },
});

function OwnTaskDetailPage() {
  const navigate = useNavigate();
  const task = Route.useLoaderData();
  const deleteTaskMutation = useDeleteTask();
  const [successMessage] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const handleDeleteTask = async () => {
    const confirmed = window.confirm("Haluatko varmasti poistaa tämän työilmoituksen?");
    if (!confirmed) {
      return;
    }

    try {
      await deleteTaskMutation.mutateAsync({ taskId: task.id });
      navigate({ to: "/employer/my-tasks", search: { tab: "active" } });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Työilmoituksen poistaminen epäonnistui.";
      setErrorMessage(message);
      setTimeout(() => setErrorMessage(""), 5000);
    }
  };

  return (
    <main className="max-w-7xl mx-auto px-6 py-12">
      {successMessage && (
        <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">{successMessage}</div>
      )}

      {errorMessage && (
        <div className="mb-6 rounded-lg border border-red-300 bg-red-50 p-4 text-red-700">{errorMessage}</div>
      )}

      <button
        onClick={() => navigate({ to: "/employer/my-tasks", search: { tab: "active" } })}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6"
      >
        <span className="material-icons">arrow_back</span>
        Takaisin omiin työilmoituksiin
      </button>

      <div className="flex mb-6 border-b">
        <button
          className={"py-2 px-4 text-sm font-medium text-green-600 border-b-2 border-green-600"}
          onClick={() => navigate({ to: "/employer/my-tasks/$taskId/details", params: { taskId: task.id.toString() } })}
        >
          Tiedot
        </button>
        <button
          className="py-2 px-4 text-sm font-medium text-gray-500 hover:text-gray-700"
          onClick={() =>
            navigate({ to: "/employer/my-tasks/$taskId/applications", params: { taskId: task.id.toString() } })
          }
        >
          Hakemukset
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-white border-b p-8">
          <h1 className="text-3xl font-bold text-gray-900">{task.title}</h1>
        </div>
        <div className="p-8">
          <>
            <TaskDetails
              task={task}
              description={task.description}
              categories={task.categories}
              getCategoryIcon={getCategoryIcon}
            />
            <div className="mt-6 flex gap-4 justify-end">
              {task.status === "COMPLETED" && (
                <Button
                  onClick={() => {
                    navigate({
                      to: "/employer/my-tasks/$taskId/review/$username",
                      params: { taskId: task.id.toString(), username: task.worker!.userName },
                    });
                  }}
                  className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 border border-gray-300"
                >
                  Arvostele
                </Button>
              )}
              <button
                onClick={() => {
                  navigate({ to: "/employer/my-tasks/$taskId/details/edit", params: { taskId: task.id.toString() } });
                }}
                className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 border border-gray-300"
              >
                Muokkaa
              </button>
              <button
                onClick={handleDeleteTask}
                disabled={deleteTaskMutation.isPending}
                className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {deleteTaskMutation.isPending ? "Poistetaan..." : "Poista"}
              </button>
            </div>
          </>
        </div>
      </div>
    </main>
  );
}
