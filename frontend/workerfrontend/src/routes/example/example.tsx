import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/example/example')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/example/example"!</div>
}
