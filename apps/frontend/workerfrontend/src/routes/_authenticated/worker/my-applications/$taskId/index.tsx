import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/worker/my-applications/$taskId/")({
  beforeLoad: ({ params }) => {
    throw redirect({
      to: "/worker/my-applications/$taskId/task-details",
      params,
      // `replace: true` estää "takaisin"-napin menemisen tyhjälle sivulle
      replace: true,
    });
  },
});
