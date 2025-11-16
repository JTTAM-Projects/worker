import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/worker/own-tasks/waiting-approval/$taskId")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/_authenticated/worker/own-tasks/waiting-approval/$taskId"!</div>;
}
