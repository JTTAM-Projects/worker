import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/worker/own-tasks/")({
  beforeLoad: () => {
    throw redirect({
      to: "/worker/own-tasks/to-do",
      // `replace: true` estää "takaisin"-napin menemisen tyhjälle sivulle
      replace: true,
    });
  },
});
