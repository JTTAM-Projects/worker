import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/employer/create-task/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_authenticated/employer/create-task/"!</div>
}
