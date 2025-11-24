import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/worker/own-tasks/$taskId/')({
  beforeLoad: ({ params }) => {
    throw redirect({
      to: "/worker/own-tasks/$taskId/task-detail",
      params,
      // `replace: true` estää "takaisin"-napin menemisen tyhjälle sivulle
      replace: true,
    });
  },
});
