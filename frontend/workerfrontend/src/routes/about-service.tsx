import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/about-service')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/about-service"!</div>
}
