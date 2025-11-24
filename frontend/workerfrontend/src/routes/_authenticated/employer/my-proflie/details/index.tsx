import { createFileRoute, useLoaderData } from "@tanstack/react-router";
import { getEmployerProfile, getUser } from "../../../../../features/Profile/api/profileApi";
import EmployerDetails from "../../../../../features/Profile/components/employer/EmployerDetails";

export const Route = createFileRoute("/_authenticated/employer/my-proflie/details/")({
    loader: async ({ context }) => {
        const [employerProfile, userDetails] = await Promise.all([
            getEmployerProfile(context.auth.getAccessToken),
            getUser(context.auth.getAccessToken, (context.auth.user as { sub: string }).sub),
        ]);
        return { employerProfile, userDetails, userEmail: (context.auth.user as { email: string }).email };
    },
    component: RouteComponent,
});

function RouteComponent() {
    const { employerProfile, userDetails, userEmail } = useLoaderData({ from: Route.id });

    return (
        <div className="container mx-auto px-6 py-12 max-w-4xl">
            <EmployerDetails employerDetails={employerProfile} userDetails={userDetails} userEmail={userEmail} />
        </div>
    );
}
