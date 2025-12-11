import { createFileRoute, Outlet } from "@tanstack/react-router";
import EmployerNavBar from "../../features/layoutcomponents/EmployerNavBar";
import Footer from "../../features/layoutcomponents/Footer";

export const Route = createFileRoute("/_authenticated/employer")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="min-h-screen w-full flex flex-col">
      <EmployerNavBar />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
