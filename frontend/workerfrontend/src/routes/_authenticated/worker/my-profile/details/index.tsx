import { createFileRoute, useLoaderData } from "@tanstack/react-router";
import { getTaskerProfile, getUser } from "../../../../../features/Profile/api/profileApi";
import TaskerDetails from "../../../../../features/Profile/components/tasker/TaskerDetails";

export const Route = createFileRoute("/_authenticated/worker/my-profile/details/")({
  loader: async ({ context }) => {
    const [taskerProfile, userDetails] = await Promise.all([
      getTaskerProfile(context.auth.getAccessToken),
      getUser(context.auth.getAccessToken, (context.auth.user as { sub: string }).sub),
    ]);
    return { taskerProfile, userDetails, userEmail: (context.auth.user as { email: string }).email };
  },
  component: RouteComponent,
});

function RouteComponent() {
  const { taskerProfile, userDetails, userEmail } = useLoaderData({ from: Route.id });

  return (
    <div className="container mx-auto px-6 py-12 max-w-4xl">
      <TaskerDetails taskerDetails={taskerProfile} userDetails={userDetails} userEmail={userEmail} />
    </div>
  );
}
