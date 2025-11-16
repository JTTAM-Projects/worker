import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/employer/my-tasks/$taskId/applications/$username")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/_authenticated/employer/my-tasks/$taskId/applcations/$username"!</div>;
}
