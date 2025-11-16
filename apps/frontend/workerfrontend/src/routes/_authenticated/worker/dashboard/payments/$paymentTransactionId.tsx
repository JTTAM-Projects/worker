import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/worker/dashboard/payments/$paymentTransactionId")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/_authenticated/worker/dashboard/payments/$paymentTransactionId"!</div>;
}
