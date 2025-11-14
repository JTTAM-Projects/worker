import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/employer/my-tasks/$taskId/")({
  beforeLoad: ({ params }) => {
    throw redirect({
      to: "/employer/my-tasks/$taskId/details",
      params,
      replace: true,
    });
  },
});
