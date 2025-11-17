import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/worker/my-profile/reviews/$reviewId")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/_authenticated/worker/my-profile/reviews/$reviewId"!</div>;
}
