import { createFileRoute } from '@tanstack/react-router'
import CreateReviewForm from '../../../../../../features/review/components/CreateReviewForm'

export const Route = createFileRoute(
  '/_authenticated/employer/my-tasks/$taskId/review/',
)({
  component: ReviewPage,
})

function ReviewPage(){
  const { taskId } = Route.useParams();
  const cancelRoute = "this";
  const submitRoute = "that";
  const reviewee = "kaisla";

  return (
    <CreateReviewForm taskId={parseInt(taskId)} cancelRoute={cancelRoute} submitRoute={submitRoute} revieweeUsername={reviewee}/>
  )
}
