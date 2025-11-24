import { createFileRoute } from "@tanstack/react-router";
import ProfileNavigation from "../../../../features/Profile/components/ProfileNavigation";

export const Route = createFileRoute("/_authenticated/worker/my-profile/")({
    component: RouteComponent,
});

function RouteComponent() {
    return (
        <div className="container mx-auto px-6 py-12 max-w-4xl">
            <ProfileNavigation type="worker" />
        </div>
    );
}
