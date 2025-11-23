import { useState } from "react";
import { useAuth } from "../../../auth/useAuth";
import { useGetApplication } from "../hooks/useGetApplication";
import { useCreateApplication } from "../hooks/useCreateApplication";
import { useUpdateApplication } from "../hooks/useUpdateApplication";
import { useDeleteApplication } from "../hooks/useDeleteApplication";
import TaskApplyButtonActions from "./TaskApplyButtonActions";
import MyApplicationCard from "./MyApplicationCard";
import ApplicationForm, { type ApplicationFormValues } from "./ApplicationForm";
import type { Task } from "../../task/types";

interface UserApplicationSectionProps {
  task: Task;
  onFeedback: (type: "success" | "error", message: string) => void;
}

// Orchestrates the entire user application workflow: checking auth, fetching existing application, and coordinating child components.
// Manages state for form visibility (create/edit modes) and handles all CRUD operations via mutation hooks with feedback callbacks.
export default function UserApplicationSection({
  task,
  onFeedback,
}: UserApplicationSectionProps) {
  const { isAuthenticated, loginWithRedirect, user } = useAuth();
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");

  const { data: application, isLoading: applicationLoading } =
    useGetApplication(task.id);

  const createApplication = useCreateApplication();
  const updateApplication = useUpdateApplication();
  const deleteApplication = useDeleteApplication();

  const hasApplied = Boolean(application);
  const applyButtonBusy =
    applicationLoading ||
    createApplication.isPending ||
    updateApplication.isPending;

  const ensureAuthenticated = () => {
    if (!isAuthenticated) {
      loginWithRedirect();
      return false;
    }
    return true;
  };

  const handleApplyClick = () => {
    if (!ensureAuthenticated()) {
      return;
    }

    if (hasApplied) {
      setFormMode("edit");
      setShowApplicationForm((prev) => !prev);
    } else {
      setFormMode("create");
      setShowApplicationForm((prev) => !prev);
    }
  };

  const handleApplicationSuccess = (mode: "create" | "edit") => {
    setShowApplicationForm(false);
    onFeedback(
      "success",
      mode === "edit"
        ? "Hakemus päivitettiin onnistuneesti!"
        : "Hakemus lähetettiin onnistuneesti!"
    );
  };

  const handleDeleteApplication = async () => {
    if (!ensureAuthenticated()) {
      return;
    }
    const confirmed = window.confirm(
      "Haluatko varmasti perua tämän hakemuksen?"
    );
    if (!confirmed) {
      return;
    }

    try {
      await deleteApplication.mutateAsync({ taskId: task.id });
      setFormMode("create");
      setShowApplicationForm(false);
      onFeedback("success", "Hakemus peruttiin onnistuneesti.");
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Hakemuksen peruminen epäonnistui.";
      onFeedback("error", message);
    }
  };

  const handleFormSubmit = async (values: ApplicationFormValues) => {
    if (formMode === "edit") {
      await updateApplication.mutateAsync({
        taskId: task.id,
        payload: values,
      });
    } else {
      await createApplication.mutateAsync({
        taskId: task.id,
        payload: values,
      });
    }
  };

  const applicationInitialValues = application
    ? {
        priceSuggestion: application.priceSuggestion,
        timeSuggestion: application.timeSuggestion,
        description: application.description,
      }
    : undefined;

  return (
    <>
      <div className="flex justify-end mt-6">
        <TaskApplyButtonActions
          isAuthenticated={isAuthenticated}
          user={user}
          hasApplied={hasApplied}
          checkingApplication={applyButtonBusy}
          showApplicationForm={showApplicationForm}
          task={task}
          onApplyClick={handleApplyClick}
        />
      </div>

      {hasApplied && application && (
        <MyApplicationCard
          application={application}
          onEdit={() => {
            setFormMode("edit");
            setShowApplicationForm(true);
          }}
          onDelete={handleDeleteApplication}
          isDeleting={deleteApplication.isPending}
        />
      )}

      {showApplicationForm && isAuthenticated && (
        <ApplicationForm
          taskPrice={task.price}
          mode={formMode}
          initialValues={
            formMode === "edit" ? applicationInitialValues : undefined
          }
          onSubmit={handleFormSubmit}
          onSuccess={() => handleApplicationSuccess(formMode)}
          onCancel={() => setShowApplicationForm(false)}
        />
      )}
    </>
  );
}
