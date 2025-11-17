import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/worker/my-profile/details/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/_authenticated/worker/my-profile/details/"!</div>;
}
