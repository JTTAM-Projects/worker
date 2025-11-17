import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { TaskWizardForm, type SubmissionState } from "../features/task/components/TaskWizardForm";
import {
  useCreateUser,
  useGetUserDetails,
  useUpdateUser,
} from "../features/Profile/hooks/userHooks";
import { useCreateTask } from "../features/task/hooks";
import type { TaskWizardPayload } from "../features/task/components/TaskWizardForm";

export default function CreateTaskPage() {
  const navigate = useNavigate();
  const {
    isAuthenticated,
    isLoading: authLoading,
    loginWithRedirect,
    user: authUser,
  } = useAuth0();

  const { data: userDetails } = useGetUserDetails();
  const { mutateAsync: createUser } = useCreateUser();
  const { mutateAsync: updateUser } = useUpdateUser();
  const { mutateAsync: createTask, isPending: isCreatingTask } =
    useCreateTask();

  const [submissionState, setSubmissionState] =
    useState<SubmissionState>("idle");
  const [submissionError, setSubmissionError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      void loginWithRedirect({
        appState: { returnTo: "/create-task" },
      });
    }
  }, [authLoading, isAuthenticated, loginWithRedirect]);

  const initialContact = useMemo(
    () => ({
      firstName: authUser?.given_name ?? "",
      lastName: authUser?.family_name ?? "",
      email: authUser?.email ?? "",
      phoneNumber: userDetails?.phoneNumber ?? "",
    }),
    [authUser?.email, authUser?.family_name, authUser?.given_name, userDetails]
  );

  if (authLoading || !isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="rounded-lg border border-gray-200 bg-white px-6 py-4 shadow-sm text-gray-600">
          {(authLoading && "Ladataan...") ||
            "Uudelleenohjataan kirjautumiseen..."}
        </div>
      </div>
    );
  }

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
      // jatketaan silti taskin luonnilla
    }

    try {
      await createTask({
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
        "Ilmoituksen luominen epäonnistui. Tarkista tiedot ja yritä uudelleen."
      );
    }
  };

  return (
    <TaskWizardForm
      mode="create"
      onCancel={() => navigate(-1)}
      onSubmit={handleSubmit}
      isSubmitting={isCreatingTask || submissionState === "loading"}
      submissionState={submissionState}
      submissionError={submissionError}
      submitLabel="Luo ilmoitus"
      successMessage="Ilmoitus luotiin onnistuneesti! Uudelleenohjataan omiin työilmoituksiin..."
      initialContact={initialContact}
    />
  );
}
