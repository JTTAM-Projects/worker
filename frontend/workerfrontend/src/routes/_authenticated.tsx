import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated")({
  component: RouteComponent,
  beforeLoad: ({ context }) => {
    if (!context.auth.isAuthenticated) {
      context.auth.login();
    }
  },
});

function RouteComponent() {
  return (
    <div>
      <Outlet />
    </div>
  );
}
