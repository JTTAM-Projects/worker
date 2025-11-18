import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { taskQueries } from "../../../../../features/task/queries/taskQueries";
import TaskExecutionWizard from "../../../../../features/task/components/TaskExecutionWizard";
import { useAuth0 } from "@auth0/auth0-react";
import { completeTaskExecution } from "../../../../../features/task/api/taskApi";

export const Route = createFileRoute("/_authenticated/worker/own-tasks/to-do/$taskId")({
  loader: ({ params, context }) => context.queryClient.ensureQueryData(taskQueries.detail(params.taskId)),
  component: TaskExecutionPage,
});

function TaskExecutionPage() {
  const { taskId } = Route.useParams();
  const navigate = useNavigate();
  const { data: task } = useSuspenseQuery(taskQueries.detail(taskId));
  const { getAccessTokenSilently } = useAuth0();
  const queryClient = useQueryClient();

  const completeTaskMutation = useMutation({
    mutationFn: () => completeTaskExecution(getAccessTokenSilently, task.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["tasks", "detail", taskId] });
      queryClient.invalidateQueries({ queryKey: ["applications"] });
    },
  });

  return (
    <main className="max-w-5xl mx-auto px-6 py-12 space-y-8">
      <TaskExecutionWizard
        taskTitle={task.title}
        onComplete={() => completeTaskMutation.mutateAsync()}
        onFinish={() => {
          navigate({
            to: "/worker/own-tasks/to-do",
            replace: true,
          });
        }}
        onBack={() => {
          navigate({ to: "/worker/own-tasks/to-do" });
        }}
      />
    </main>
  );
}
