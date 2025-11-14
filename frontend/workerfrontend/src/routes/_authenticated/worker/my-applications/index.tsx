import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/worker/my-applications/")({
  beforeLoad: () => {
    throw redirect({
      to: "/worker/my-applications/active",
      // `replace: true` estää "takaisin"-napin menemisen tyhjälle sivulle
      replace: true,
    });
  },
});
