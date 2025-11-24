import { createFileRoute, useLoaderData } from "@tanstack/react-router";
import { getEmployerProfile, getUser } from "../../../../../features/Profile/api/profileApi";
import EmployerDetailsEditForm from "../../../../../features/Profile/components/employer/employerDetailsEditForm";

export const Route = createFileRoute("/_authenticated/employer/my-proflie/details/edit")({
    loader: async ({ context }) => {
        const employerDetails = await getEmployerProfile(context.auth.getAccessToken);
        const userDetails = await getUser(context.auth.getAccessToken, (context.auth.user as { sub: string }).sub);
        return { employerDetails, userDetails };
    },
    component: RouteComponent,
});

function RouteComponent() {
    const { employerDetails, userDetails } = useLoaderData({ from: Route.id });

    return (
        <div className="container mx-auto px-6 py-12 max-w-4xl">
            <EmployerDetailsEditForm
                initialValues={{ ...userDetails, ...employerDetails }}
                onSuccess={() => window.history.back()}
            />
        </div>
    );
}
