import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/employer/my-proflie/reviews/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/_authenticated/employer/my-proflie/reviews/"!</div>;
}
