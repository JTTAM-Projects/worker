import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/worker/own-tasks/past/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/_authenticated/worker/own-tasks/past/"!</div>;
}
