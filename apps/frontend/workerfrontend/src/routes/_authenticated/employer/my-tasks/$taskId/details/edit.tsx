import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, useNavigate, useParams } from "@tanstack/react-router";
import { taskQueries } from "../../../../../../features/task/queries/taskQueries";
import { useUpdateTask } from "../../../../../../features/task/hooks/useTask";
import { useGetUserDetails, useUpdateUser } from "../../../../../../features/Profile/hooks/userHooks";
import { useMemo, useState } from "react";
import {
  TaskWizardForm,
  type SubmissionState,
  type TaskWizardPayload,
} from "../../../../../../features/task/components/TaskWizardForm";

export const Route = createFileRoute("/_authenticated/employer/my-tasks/$taskId/details/edit")({
  component: EditTaskPage,
  loader: async ({ context, params }) => {
    return context.queryClient.ensureQueryData(taskQueries.detail(params.taskId));
  },
});

export default function EditTaskPage() {
  const taskId = useParams({
    from: "/_authenticated/employer/my-tasks/$taskId/details/edit",
    select: (params) => params.taskId,
  });
  const navigate = useNavigate();

  const { data: taskData } = useSuspenseQuery(taskQueries.detail(taskId));
  const { mutateAsync: updateTaskMutation, isPending: isUpdatingTask } = useUpdateTask(parseInt(taskId));

  const { data: userDetails } = useGetUserDetails();
  const { mutateAsync: updateUser } = useUpdateUser();

  const [submissionState, setSubmissionState] = useState<SubmissionState>("idle");
  const [submissionError, setSubmissionError] = useState<string | null>(null);

  const initialContact = useMemo(
    () => ({
      firstName: "",
      lastName: "",
      phoneNumber: userDetails?.phoneNumber ?? taskData?.user?.phoneNumber ?? "",
      email: userDetails?.mail ?? taskData?.user?.mail ?? "",
    }),
    [taskData?.user?.mail, taskData?.user?.phoneNumber, userDetails]
  );

  const initialTask = {
    title: taskData.title ?? "",
    description: taskData.description ?? "",
    categoryTitle: taskData.categories?.[0]?.title ?? "",
    price: taskData.price?.toString() ?? "",
    startDate: new Date(taskData.startDate).toISOString().slice(0, 16),
    endDate: new Date(taskData.endDate).toISOString().slice(0, 16),
    streetAddress: taskData.location?.streetAddress ?? "",
    postalCode: taskData.location?.postalCode ?? "",
    city: taskData.location?.city ?? "",
    country: taskData.location?.country ?? "Suomi",
  };

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

    try {
      if (userDetails) {
        await updateUser({
          mail: contact.email.trim(),
          phoneNumber: contact.phoneNumber.trim(),
          address: addressForProfile,
          businessId: userDetails.businessId ?? "",
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
      setTimeout(() => navigate({ to: "/employer/my-tasks/$taskId/details", params: { taskId: taskId } }), 1500);
    } catch (error) {
      console.error(error);
      setSubmissionState("error");
      setSubmissionError("Ilmoituksen päivittäminen epäonnistui. Tarkista tiedot ja yritä uudelleen.");
    }
  };

  return (
    <TaskWizardForm
      mode="edit"
      onCancel={() => window.history.back()}
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
