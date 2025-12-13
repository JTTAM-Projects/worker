import { createFileRoute, Outlet } from "@tanstack/react-router";
import WorkerNavBar from "../../features/layoutcomponents/WorkerNavBar";
import Footer from "../../features/layoutcomponents/Footer";

export const Route = createFileRoute("/_authenticated/worker")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="min-h-screen w-full flex flex-col">
      <WorkerNavBar />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
