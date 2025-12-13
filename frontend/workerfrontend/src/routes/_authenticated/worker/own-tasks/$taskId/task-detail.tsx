import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useState } from "react";
import { taskQueries } from "../../../../../features/task/queries/taskQueries";
import TaskDetails from "../../../../../features/task/components/TaskDetails";
import { getCategoryIcon } from "../../../../../features/task/utils/categoryUtils";

export const Route = createFileRoute("/_authenticated/worker/own-tasks/$taskId/task-detail")({
  loader: ({ context: { queryClient }, params: { taskId } }) => {
    return queryClient.ensureQueryData(taskQueries.detail(taskId));
  },
  component: TaskExecutionDetailsPage,
});

function TaskExecutionDetailsPage() {
  const taskId = Route.useParams().taskId;
  const navigate = useNavigate();
  const { data: task } = useSuspenseQuery(taskQueries.detail(taskId));
  const [feedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  return (
    <div className="container mx-auto px-6 py-8">
      {feedback && (
        <div
          className={`mb-4 p-4 rounded-lg ${
            feedback.type === "success"
              ? "bg-green-50 border border-green-200 text-green-700"
              : "bg-red-50 border border-red-200 text-red-700"
          }`}
        >
          {feedback.message}
        </div>
      )}

      <h1 className="text-2xl font-bold text-gray-800 mb-4">{task?.title}</h1>

      <div className="flex mb-6 justify-center">
        <button
          className={"py-2 px-4 text-sm font-medium text-green-600 border-b-2 border-green-600"}
          onClick={() => navigate({ to: "/worker/own-tasks/$taskId/task-detail", params: { taskId } })}
        >
          Tehtävän tiedot
        </button>
        <button
          className={"py-2 px-4 text-sm font-medium text-gray-500 hover:text-gray-700"}
          onClick={() => navigate({ to: "/worker/own-tasks/$taskId/taskExecution", params: { taskId } })}
        >
          Tehtävän Suoritus
        </button>
      </div>

      <TaskDetails
        task={task}
        description={task.description}
        categories={task.categories}
        getCategoryIcon={getCategoryIcon}
      />
    </div>
  );
}
