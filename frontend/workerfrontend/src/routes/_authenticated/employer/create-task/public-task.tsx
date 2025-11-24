import { useAuth0 } from "@auth0/auth0-react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useGetUserDetails } from "../../../../features/Profile/hooks/userHooks";
import { useCreateTask } from "../../../../features/task/hooks";
import { useEffect, useMemo, useState } from "react";
import {
  TaskWizardForm,
  type SubmissionState,
  type TaskWizardPayload,
} from "../../../../features/task/components/TaskWizardForm";
import { createUser, updateUser } from "../../../../features/Profile/api/profileApi";
import { geocodeAddress } from "../../../../utils/geocoding";

export const Route = createFileRoute("/_authenticated/employer/create-task/public-task")({
  component: CreateTaskPage,
});

function CreateTaskPage() {
  const navigate = useNavigate();
  const {
    isAuthenticated,
    isLoading: authLoading,
    loginWithRedirect,
    user: authUser,
    getAccessTokenSilently,
  } = useAuth0();

  const { data: userDetails } = useGetUserDetails();
  const { mutateAsync: createTask, isPending: isCreatingTask } = useCreateTask();

  const [submissionState, setSubmissionState] = useState<SubmissionState>("idle");
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
          {(authLoading && "Ladataan...") || "Uudelleenohjataan kirjautumiseen..."}
        </div>
      </div>
    );
  }

  const toLocalDateTime = (value: string) => {
    if (!value) return value;
    return value.length === 16 ? `${value}:00` : value;
  };

  const handleSubmit = async (payload: TaskWizardPayload) => {
    const { task, contact, categories, location } = payload;

    setSubmissionState("loading");
    setSubmissionError(null);

    const priceInt = Number(task.price);
    const isoStart = toLocalDateTime(task.startDate);
    const isoEnd = toLocalDateTime(task.endDate);

    const addressForProfile = `${location.streetAddress} ${location.postalCode}, ${location.city}, ${location.country}`;

    // Geocode the address to get coordinates
    const geocodeResult = await geocodeAddress({
      streetAddress: location.streetAddress,
      postalCode: location.postalCode,
      city: location.city,
      country: location.country,
    });

    if (!geocodeResult) {
      setSubmissionState("error");
      setSubmissionError(
        "Osoitteen geokoodaus epäonnistui. Tarkista osoite ja yritä uudelleen."
      );
      return;
    }

    try {
      if (userDetails) {
        await updateUser(getAccessTokenSilently, {
          mail: contact.email.trim(),
          phoneNumber: contact.phoneNumber.trim(),
          address: addressForProfile,
          businessId: userDetails.businessId ?? "",
        });
      } else {
        await createUser(getAccessTokenSilently, {
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
        location: {
          ...location,
          latitude: geocodeResult.latitude,
          longitude: geocodeResult.longitude,
        },
      });

      setSubmissionState("success");
      setTimeout(() => navigate({ to: "/employer/my-tasks", search: { tab: "active" } }), 1500);
    } catch (error) {
      console.error(error);
      setSubmissionState("error");
      setSubmissionError("Ilmoituksen luominen epäonnistui. Tarkista tiedot ja yritä uudelleen.");
    }
  };

  return (
    <TaskWizardForm
      mode="create"
      onCancel={() => window.history.back()}
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
