import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/employer/create-task/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <Link
        to="/employer/create-task/public-task"
        className="inline-flex h-12 w-44 items-center justify-center rounded-md bg-white border border-gray-300 hover:bg-gray-100 hover:border-green-400 font-medium"
      >
        Julkinen työilmoitus
      </Link>

      <Link
        to="/employer/create-task/job-offer"
        className="inline-flex h-12 w-44 items-center justify-center rounded-md bg-white border border-gray-300 hover:bg-gray-100 hover:border-green-400 font-medium"
      >
        Työtarjous
      </Link>
    </div>
  );
}
