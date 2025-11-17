import { createFileRoute, Outlet } from "@tanstack/react-router";
import WorkerNavBar from "../../features/layoutcomponents/WorkerNavBar";

export const Route = createFileRoute("/_authenticated/worker")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="bg-gray-50 min-h-screen w-full">
      <WorkerNavBar />
      <Outlet />
    </div>
  );
}
