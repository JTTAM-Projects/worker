import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../auth/useAuth";
import { TaskWizardForm, type SubmissionState } from "../features/task/components/TaskWizardForm";
import type { TaskWizardPayload } from "../features/task/components/TaskWizardForm";
import { useTask, useUpdateTask } from "../features/task/hooks/useTask";
import {
  useCreateUser,
  useGetUserDetails,
  useUpdateUser,
} from "../features/Profile/hooks/userHooks";

export default function EditTaskPage() {
  const { taskId } = useParams<{ taskId: string }>();
  const numericId = taskId ? Number(taskId) : NaN;
  const navigate = useNavigate();

  const {
    isAuthenticated,
    isLoading: authLoading,
    loginWithRedirect,
  } = useAuth();
  const loginAttemptedRef = useRef(false);

  const { data: taskData, isLoading: taskLoading, error: taskError } = useTask(
    Number.isNaN(numericId) ? undefined : numericId
  );
  const { mutateAsync: updateTaskMutation, isPending: isUpdatingTask } =
    useUpdateTask(Number.isNaN(numericId) ? 0 : numericId);

  const { data: userDetails } = useGetUserDetails();
  const { mutateAsync: createUser } = useCreateUser();
  const { mutateAsync: updateUser } = useUpdateUser();

  const [submissionState, setSubmissionState] =
    useState<SubmissionState>("idle");
  const [submissionError, setSubmissionError] = useState<string | null>(null);

  const initialContact = useMemo(
    () => ({
      firstName: "",
      lastName: "",
      phoneNumber:
        userDetails?.phoneNumber ?? taskData?.user?.phoneNumber ?? "",
      email: userDetails?.mail ?? taskData?.user?.mail ?? "",
    }),
    [taskData?.user?.mail, taskData?.user?.phoneNumber, userDetails]
  );

  useEffect(() => {
    if (!authLoading && !isAuthenticated && !loginAttemptedRef.current) {
      loginAttemptedRef.current = true;
      void loginWithRedirect({
        appState: { returnTo: `/edit-task/${taskId ?? ""}` },
      });
    }

    if (isAuthenticated) {
      loginAttemptedRef.current = false;
    }
  }, [authLoading, isAuthenticated, loginWithRedirect, taskId]);

  if (authLoading || taskLoading || !taskData || Number.isNaN(numericId)) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="rounded-lg border border-gray-200 bg-white px-6 py-4 shadow-sm text-gray-600">
          {Number.isNaN(numericId)
            ? "Virheellinen tehtävän tunniste."
            : (authLoading || taskLoading)
            ? "Ladataan työilmoitusta..."
            : !isAuthenticated
            ? "Uudelleenohjataan kirjautumiseen..."
            : "Ladataan..."}
        </div>
      </div>
    );
  }

  if (taskError) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="rounded-lg border border-red-200 bg-red-50 px-6 py-4 shadow-sm text-red-700">
          Työilmoituksen lataaminen epäonnistui.
        </div>
      </div>
    );
  }

  const initialTask = {
    title: taskData.title ?? "",
    description: taskData.description ?? "",
    categoryTitle: taskData.categories?.[0]?.title ?? "",
    price: taskData.price?.toString() ?? "",
    startDate: new Date(taskData.startDate).toISOString().slice(0, 16),
    endDate: new Date(taskData.endDate).toISOString().slice(0, 16),
    streetAddress: taskData.locations?.[0]?.streetAddress ?? "",
    postalCode: taskData.locations?.[0]?.postalCode ?? "",
    city: taskData.locations?.[0]?.city ?? "",
    country: taskData.locations?.[0]?.country ?? "Suomi",
  };

  const toLocalDateTime = (value: string) => {
    if (!value) return value;
    return value.length === 16 ? `${value}:00` : value;
  };

  const handleSubmit = async (payload: TaskWizardPayload) => {
    const {
      task,
      contact,
      categories,
      location,
    } = payload;

    setSubmissionState("loading");
    setSubmissionError(null);

    const priceInt = Number(task.price);
    const isoStart = toLocalDateTime(task.startDate);
    const isoEnd = toLocalDateTime(task.endDate);

    const addressForProfile = `${location.streetAddress} ${location.postalCode}, ${location.city}, ${location.country}`;

    try {
      if (userDetails) {
        await updateUser({
          mail: contact.email.trim(),
          phoneNumber: contact.phoneNumber.trim(),
          address: addressForProfile,
          businessId: userDetails.businessId ?? "",
        });
      } else {
        await createUser({
          userName: "",
          mail: contact.email.trim(),
          phoneNumber: contact.phoneNumber.trim(),
          address: addressForProfile,
          businessId: "",
        });
      }
    } catch (error) {
      console.error("Käyttäjätietojen päivitys epäonnistui", error);
    }

    try {
      await updateTaskMutation({
        title: task.title.trim(),
        description: task.description.trim(),
        price: Number.isNaN(priceInt) ? 0 : priceInt,
        startDate: isoStart,
        endDate: isoEnd,
        categories,
        location,
      });
      setSubmissionState("success");
      setTimeout(() => navigate("/my-tasks"), 1500);
    } catch (error) {
      console.error(error);
      setSubmissionState("error");
      setSubmissionError(
        "Ilmoituksen päivittäminen epäonnistui. Tarkista tiedot ja yritä uudelleen."
      );
    }
  };

  return (
    <TaskWizardForm
      mode="edit"
      onCancel={() => navigate(-1)}
      onSubmit={handleSubmit}
      isSubmitting={isUpdatingTask || submissionState === "loading"}
      submissionState={submissionState}
      submissionError={submissionError}
      submitLabel="Tallenna muutokset"
      successMessage="Ilmoitus päivitettiin onnistuneesti! Uudelleenohjataan omiin työilmoituksiin..."
      initialTask={initialTask}
      initialContact={initialContact}
    />
  );
}
