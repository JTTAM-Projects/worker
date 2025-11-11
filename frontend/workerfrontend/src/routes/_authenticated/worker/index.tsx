import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/worker/")({
  beforeLoad: () => {
    throw redirect({
      to: "/worker/tasks",
      // `replace: true` estää "takaisin"-napin menemisen tyhjälle sivulle
      replace: true,
    });
  },
});
