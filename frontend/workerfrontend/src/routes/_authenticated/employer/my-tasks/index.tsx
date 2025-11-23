import { createFileRoute } from "@tanstack/react-router";
import MyTasksPage from "../../../../pages/MyTasksPage";
import { taskQueries } from "../../../../features/task/queries/taskQueries";

export const Route = createFileRoute("/_authenticated/employer/my-tasks/")({
  component: MyTasksPage,
  validateSearch: (search: Record<string, any>) => {
    return {
      tab: (search.tab as string) || "active",
    };
  },
  loaderDeps: ({ search }) => ({ tab: search.tab }),
  loader: async ({ context, deps }) => {
    const status =
      deps.tab === "active"
        ? "ACTIVE"
        : deps.tab === "in-progress"
          ? "IN_PROGRESS"
          : deps.tab === "done"
            ? "COMPLETED"
            : "ACTIVE";

    return context.queryClient.ensureQueryData(
      taskQueries.own(context.auth.getAccessToken, { page: 0, size: 6, status })
    );
  },
});
