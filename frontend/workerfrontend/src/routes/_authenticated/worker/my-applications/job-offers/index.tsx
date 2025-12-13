import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/worker/my-applications/job-offers/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/_authenticated/worker/my-applications/job-offers/"!</div>;
}
