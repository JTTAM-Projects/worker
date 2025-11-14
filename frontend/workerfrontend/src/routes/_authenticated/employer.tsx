import { createFileRoute, Outlet } from "@tanstack/react-router";
import EmployerNavBar from "../../features/layoutcomponents/EmployerNavBar";

export const Route = createFileRoute("/_authenticated/employer")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="bg-gray-50 min-h-screen w-full">
      <EmployerNavBar />
      <Outlet />
    </div>
  );
}
