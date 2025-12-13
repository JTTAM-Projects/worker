import { createFileRoute, useLoaderData } from "@tanstack/react-router";
import { getTaskerProfile, getUser } from "../../../../../features/Profile/api/profileApi";
import TaskerDetailsEditForm from "../../../../../features/Profile/components/tasker/TaskerDetailsEditForm";

export const Route = createFileRoute("/_authenticated/worker/my-profile/details/edit")({
  loader: async ({ context }) => {
    const taskerDetails = await getTaskerProfile(context.auth.getAccessToken);
    const userDetails = await getUser(context.auth.getAccessToken, (context.auth.user as { sub: string }).sub);
    return { taskerDetails, userDetails };
  },
  component: RouteComponent,
});

function RouteComponent() {
  const { taskerDetails, userDetails } = useLoaderData({ from: Route.id });

  return (
    <div className="container mx-auto px-6 py-12 max-w-4xl">
      <TaskerDetailsEditForm
        initialValues={{ ...userDetails, ...taskerDetails }}
        onSuccess={() => window.history.back()}
      />
    </div>
  );
}
