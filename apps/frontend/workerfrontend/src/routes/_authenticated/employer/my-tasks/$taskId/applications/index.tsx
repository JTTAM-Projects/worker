import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { taskQueries } from "../../../../../../features/task/queries/taskQueries";
import ApplicationsList from "../../../../../../features/application/components/ApplicationsList";
import { useUpdateApplicationStatus } from "../../../../../../features/task/hooks/useUpdateApplicationStatus";
import { useEffect, useState } from "react";
import ApplicationModal from "../../../../../../features/application/components/ApplicationDetailsModal";
import { useSuspenseQuery } from "@tanstack/react-query";
import type { TaskApplicationDetails } from "../../../../../../features/task/api/taskApi";

export const Route = createFileRoute("/_authenticated/employer/my-tasks/$taskId/applications/")({
  component: OwnTaskApplicationsPage,
  loader: async ({ context, params }) => {
    return context.queryClient.ensureQueryData(taskQueries.applications(parseInt(params.taskId)));
  },
});

function OwnTaskApplicationsPage() {
  const navigate = useNavigate();
  const { taskId } = Route.useParams();
  const { data: applications } = useSuspenseQuery(taskQueries.applications(parseInt(taskId)));
  const updateApplicationStatus = useUpdateApplicationStatus();
  const lastStatus = updateApplicationStatus.variables?.status;
  const handleUpdateStatus = (status: "ACCEPTED" | "REJECTED") => {
    if (selectedApplication) {
      const applicantUsername = selectedApplication.user?.userName ?? selectedApplication.appliedUser.userName;
      updateApplicationStatus.mutate({
        taskId: parseInt(taskId),
        applicantUsername,
        status,
      });
    }
  };
  const [selectedApplication, setSelectedApplication] = useState<TaskApplicationDetails | null>(null);
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [errorMessage] = useState<string>("");

  // Close modal and show success message when application status is updated successfully
  useEffect(() => {
    if (!updateApplicationStatus.isSuccess) {
      return;
    }
    setSelectedApplication(null);
    if (lastStatus === "REJECTED") {
      setSuccessMessage("Hakemus hylätty onnistuneesti!");
    } else if (lastStatus === "ACCEPTED") {
      setSuccessMessage("Hakemus hyväksytty onnistuneesti!");
    } else {
      setSuccessMessage("Hakemuksen tila päivitetty.");
    }
    const timeout = window.setTimeout(() => setSuccessMessage(""), 3000);
    return () => window.clearTimeout(timeout);
  }, [lastStatus, updateApplicationStatus.isSuccess]);

  return (
    <main className="max-w-7xl mx-auto px-6 py-12">
      {successMessage && (
        <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">{successMessage}</div>
      )}

      {errorMessage && (
        <div className="mb-6 rounded-lg border border-red-300 bg-red-50 p-4 text-red-700">{errorMessage}</div>
      )}

      <button
        onClick={() => navigate({ to: "/employer/my-tasks" })}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6"
      >
        <span className="material-icons">arrow_back</span>
        Takaisin omiin työilmoituksiin
      </button>

      <div className="flex mb-6 border-b">
        <button
          className={"py-2 px-4 text-sm font-medium text-gray-500 hover:text-gray-700"}
          onClick={() => navigate({ to: "/employer/my-tasks/$taskId/details", params: { taskId: taskId.toString() } })}
        >
          Tiedot
        </button>
        <button
          className="py-2 px-4 text-sm font-medium text-green-600 border-b-2 border-green-600"
          onClick={() =>
            navigate({ to: "/employer/my-tasks/$taskId/applications", params: { taskId: taskId.toString() } })
          }
        >
          Hakemukset
        </button>
      </div>

      <>
        <ApplicationsList applications={applications} taskId={taskId} onSelect={setSelectedApplication} />
        {selectedApplication && (
          <ApplicationModal
            application={selectedApplication}
            onClose={() => setSelectedApplication(null)}
            onUpdateStatus={(status) => handleUpdateStatus(status)}
          />
        )}
      </>
    </main>
  );
}
