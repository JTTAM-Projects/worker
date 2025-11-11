import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_authenticated/worker/_worker-layout',
)({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/__authenticated/__worker/_worker_layout"!</div>
}
