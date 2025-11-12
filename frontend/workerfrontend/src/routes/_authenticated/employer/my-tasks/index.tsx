import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/employer/my-tasks/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_authenticated/employer/my-tasks/"!</div>
}
