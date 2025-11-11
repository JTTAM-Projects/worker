import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_authenticated/worker/my-applications/past/$taskId',
)({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div>Hello "/__authenticated/__worker/my-applications/past/$taskId"!</div>
  )
}
