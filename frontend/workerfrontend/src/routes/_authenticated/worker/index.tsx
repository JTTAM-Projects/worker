import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/worker/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_authenticated/_worker/"!</div>
}
