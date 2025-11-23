import { createFileRoute, useNavigate } from "@tanstack/react-router";
import CreateReviewForm from "../../../../../../features/review/components/CreateReviewForm";

export const Route = createFileRoute("/_authenticated/employer/my-tasks/$taskId/review/$username")({
  component: ReviewPage,
});

function ReviewPage() {
  const navigate = useNavigate();
  const { taskId, username } = Route.useParams();

  return (
    <CreateReviewForm
      taskId={parseInt(taskId)}
      cancelRoute={() => navigate({ to: "/employer/my-tasks/$taskId/details" })}
      submitRoute={() => navigate({ to: "/employer/my-tasks/$taskId/details" })}
      revieweeUsername={username}
    />
  );
}
