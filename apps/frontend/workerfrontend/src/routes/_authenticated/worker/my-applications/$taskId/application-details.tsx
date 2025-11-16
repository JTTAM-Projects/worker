import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useGetApplication } from "../../../../../features/application/hooks/useGetApplication";
import { useState } from "react";
import type { ApplicationFormValues } from "../../../../../features/application/components/ApplicationForm";
import { useUpdateApplication } from "../../../../../features/application/hooks/useUpdateApplication";
import { useDeleteApplication } from "../../../../../features/application/hooks/useDeleteApplication";
import ApplicationForm from "../../../../../features/application/components/ApplicationForm";
import { useSuspenseQuery } from "@tanstack/react-query";
import { taskQueries } from "../../../../../features/task/queries/taskQueries";

export const Route = createFileRoute("/_authenticated/worker/my-applications/$taskId/application-details")({
  component: ApplicationDetailsPage,
});

function ApplicationDetailsPage() {
  const taskId = parseInt(Route.useParams().taskId);
  const { data: task } = useSuspenseQuery(taskQueries.detail(taskId.toString()));
  const navigate = useNavigate();
  const { data: application } = useGetApplication(taskId);
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const updateApplication = useUpdateApplication();
  const deleteApplication = useDeleteApplication();

  const handleUpdateApplication = async (values: ApplicationFormValues) => {
    await updateApplication.mutateAsync({
      taskId,
      payload: values,
    });
  };

  const handleDeleteApplication = async () => {
    const confirmed = window.confirm("Haluatko varmasti poistaa hakemuksen?");
    if (!confirmed) return;

    try {
      await deleteApplication.mutateAsync({ taskId });
      setFeedback({
        type: "success",
        message: "Hakemus poistettu onnistuneesti",
      });
      setTimeout(() => navigate({ to: "/worker/my-applications/active" }));
    } catch (error) {
      setFeedback({
        type: "error",
        message: error instanceof Error ? error.message : "Poisto epäonnistui",
      });
    }
  };

  return (
    <div className="container mx-auto px-6 py-8">
      {feedback && (
        <div
          className={`mb-4 p-4 rounded-lg ${
            feedback.type === "success"
              ? "bg-green-50 border border-green-200 text-green-700"
              : "bg-red-50 border border-red-200 text-red-700"
          }`}
        >
          {feedback.message}
        </div>
      )}
      <h1 className="text-2xl font-bold text-gray-800 mb-4">{task?.title}</h1>

      <div className="flex mb-6 justify-center">
        <button
          className={"py-2 px-4 text-sm font-medium text-gray-500 hover:text-gray-700"}
          onClick={() =>
            navigate({ to: "/worker/my-applications/$taskId/task-details", params: { taskId: taskId.toString() } })
          }
        >
          Tehtävän tiedot
        </button>
        <button
          className={"py-2 px-4 text-sm font-medium text-green-600 border-b-2 border-green-600"}
          onClick={() =>
            navigate({
              to: "/worker/my-applications/$taskId/application-details",
              params: { taskId: taskId.toString() },
            })
          }
        >
          Hakemuksen tiedot
        </button>
      </div>
      <>
        {!application && <div className="text-gray-600">Hakemuksen tiedot puuttuvat.</div>}
        {application && task && (
          <div className="max-w-4xl mx-auto">
            <ApplicationForm
              taskPrice={task.price}
              mode="edit"
              initialValues={{
                priceSuggestion: application.priceSuggestion,
                timeSuggestion: application.timeSuggestion,
                description: application.description,
              }}
              onSubmit={handleUpdateApplication}
              onSuccess={() => {
                setFeedback({
                  type: "success",
                  message: "Hakemus päivitetty onnistuneesti!",
                });
              }}
              onCancel={() =>
                navigate({
                  to: "/worker/my-applications/$taskId/application-details",
                  params: { taskId: taskId.toString() },
                })
              }
            />

            <div className="mt-6 flex justify-center">
              <button
                onClick={handleDeleteApplication}
                disabled={deleteApplication.isPending}
                className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <span className="material-icons text-sm">delete</span>
                {deleteApplication.isPending ? "Poistetaan..." : "Poista hakemus"}
              </button>
            </div>
          </div>
        )}
      </>
    </div>
  );
}
