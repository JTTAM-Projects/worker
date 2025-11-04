import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useTaskById } from "../features/task/hooks/useTaskById";
import { getCategoryIcon } from "../features/task/utils/categoryUtils";
import TaskApplyButtonActions from "../features/task/components/TaskApplyButtonActions";
import TaskDetails from "../features/task/components/TaskDetails";
import ApplicationsList from "../features/task/components/ApplicationsList";
import ApplicationForm, {
  type ApplicationFormValues,
} from "../features/task/components/ApplicationForm";
import { useGetApplication } from "../features/application/hooks/useGetApplication";
import { useCreateApplication } from "../features/application/hooks/useCreateApplication";
import { useUpdateApplication } from "../features/application/hooks/useUpdateApplication";
import { useDeleteApplication } from "../features/application/hooks/useDeleteApplication";

export default function TaskDetailPage() {
  const navigate = useNavigate();
  const { taskId } = useParams<{ taskId: string }>();
  const location = useLocation();
  const { isAuthenticated, loginWithRedirect, user } = useAuth0();
  const numericTaskId = taskId ? Number(taskId) : NaN;
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [feedback, setFeedback] = useState<
    | null
    | {
        type: "success" | "error";
        message: string;
      }
  >(null);

  //Conditional return based on which page user came to TaskDetailPage: ActiveApplicationsPage / TaskPage
  const cameFromApplications = (location.state as { from?: string } | null)?.from ==="applications";
  const browseHistory = cameFromApplications ? "/active-applications" : "/tasks";
  const canGoBack = (window.history?.state?.idx ?? 0) > 0;
  const goBack = () => (canGoBack ? navigate(-1) : navigate(browseHistory))

  const { data: task, isLoading, isError } = useTaskById(Number(taskId));
  const {
    data: application,
    isLoading: applicationLoading,
  } = useGetApplication(Number.isNaN(numericTaskId) ? 0 : numericTaskId);

  const createApplication = useCreateApplication();
  const updateApplication = useUpdateApplication();
  const deleteApplication = useDeleteApplication();

  const hasApplied = Boolean(application);
  const applyButtonBusy =
    applicationLoading || createApplication.isPending || updateApplication.isPending;

  const showFeedback = (type: "success" | "error", message: string) => {
    setFeedback({ type, message });
    window.setTimeout(() => setFeedback(null), 8000);
  };

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
    showFeedback(
      "success",
      mode === "edit"
        ? "Hakemus päivitettiin onnistuneesti!"
        : "Hakemus lähetettiin onnistuneesti!"
    );
  };

  const handleDeleteApplication = async () => {
    if (!task || !ensureAuthenticated()) {
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
      showFeedback("success", "Hakemus peruttiin onnistuneesti.");
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Hakemuksen peruminen epäonnistui.";
      showFeedback("error", message);
    }
  };

  const handleFormSubmit = async (values: ApplicationFormValues) => {
    if (!task) {
      throw new Error("Tehtävää ei löytynyt.");
    }

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

  if (isLoading) {
    return (
      <main className="container mx-auto px-6 py-12">
        <div className="text-center text-gray-600">Ladataan tehtävää...</div>
      </main>
    );
  }

  if (isError || !task) {
    return (
      <main className="container mx-auto px-6 py-12">
        <div className="text-center text-red-600">
          Virhe ladattaessa tehtävää: {"Tehtävää ei löytynyt"}
        </div>
        <div className="text-center mt-4">
          <button
            onClick={goBack}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Palaa takaisin
          </button>
        </div>
      </main>
    );
  }

  const applicationInitialValues = application
    ? {
        priceSuggestion: application.priceSuggestion,
        timeSuggestion: application.timeSuggestion,
        description: application.description,
      }
    : undefined;

  return (
    <main className="max-w-7xl mx-auto px-6 py-12">
      {feedback && (
        <div
          className={`mb-6 rounded-lg border px-4 py-4 text-sm ${
            feedback.type === "success"
              ? "border-green-200 bg-green-50 text-green-800"
              : "border-red-200 bg-red-50 text-red-700"
          }`}
        >
          <div className="flex items-center gap-3">
            <span className="material-icons">
              {feedback.type === "success" ? "check_circle" : "error"}
            </span>
            <span className="font-semibold">{feedback.message}</span>
          </div>
        </div>
      )}

      <button
        onClick={goBack}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6"
      >
        <span className="material-icons">arrow_back</span>
        Palaa Takaisin
      </button>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-white border-b p-8">
          <h1 className="text-3xl font-bold text-gray-900">{task.title}</h1>
        </div>

        <div className="p-8">
          <TaskDetails
            task={task}
            description={task.description}
            categories={task.categories}
            getCategoryIcon={getCategoryIcon}
          />

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
              initialValues={formMode === "edit" ? applicationInitialValues : undefined}
              onSubmit={handleFormSubmit}
              onSuccess={() => handleApplicationSuccess(formMode)}
              onCancel={() => setShowApplicationForm(false)}
            />
          )}
        </div>
      </div>

      <div className="mt-8">
        <ApplicationsList taskId={task.id} />
      </div>
    </main>
  );
}

interface MyApplicationCardProps {
  application: {
    priceSuggestion: number;
    timeSuggestion: string;
    description?: string;
    applicationStatus: string;
  };
  onEdit: () => void;
  onDelete: () => void;
  isDeleting: boolean;
}

function MyApplicationCard({
  application,
  onEdit,
  onDelete,
  isDeleting,
}: MyApplicationCardProps) {
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

  const formatTime = (value: string) => {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      return value;
    }
    return date.toLocaleTimeString("fi-FI", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const statusVariant = (() => {
    switch (application.applicationStatus) {
      case "ACCEPTED":
        return "bg-blue-100 text-blue-700 border-blue-300";
      case "REJECTED":
        return "bg-red-100 text-red-700 border-red-300";
      case "WITHDRAWN":
        return "bg-gray-100 text-gray-700 border-gray-300";
      default:
        return "bg-green-100 text-green-700 border-green-300";
    }
  })();

  const statusLabel = (() => {
    switch (application.applicationStatus) {
      case "ACCEPTED":
        return "Hyväksytty";
      case "REJECTED":
        return "Hylätty";
      case "WITHDRAWN":
        return "Peruttu";
      default:
        return "Aktiivinen";
    }
  })();

  return (
    <div className="mt-6 bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            Oma hakemus
          </h3>
          <div>
            <span
              className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium ${statusVariant}`}
            >
              {statusLabel}
            </span>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={onEdit}
            className="inline-flex items-center gap-1 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <span className="material-icons text-sm">edit</span>
            Muokkaa
          </button>
          <button
            onClick={onDelete}
            disabled={isDeleting}
            className="inline-flex items-center gap-1 rounded-lg border border-red-300 bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
          >
            <span className="material-icons text-sm">close</span>
            {isDeleting ? "Perutaan..." : "Peru hakemus"}
          </button>
        </div>
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border border-gray-200 p-4">
          <div className="text-xs uppercase tracking-wide text-gray-500">
            Hintaehdotus
          </div>
          <div className="text-2xl font-semibold text-green-600">
            {application.priceSuggestion} €
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 p-4">
          <div className="text-xs uppercase tracking-wide text-gray-500">
            Päivämäärä
          </div>
          <div className="text-lg font-semibold text-gray-800">
            {formatDate(application.timeSuggestion)}
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 p-4">
          <div className="text-xs uppercase tracking-wide text-gray-500">
            Kellonaika
          </div>
          <div className="text-lg font-semibold text-gray-800">
            {formatTime(application.timeSuggestion)}
          </div>
        </div>
      </div>

      <div className="mt-4 border-t border-gray-200 pt-4">
        <div className="text-xs uppercase tracking-wide text-gray-500 mb-1">
          Viesti työnantajalle
        </div>
        <p className="whitespace-pre-line text-gray-700">
          {application.description?.trim() || "Ei lisätietoja"}
        </p>
      </div>
    </div>
  );
}
