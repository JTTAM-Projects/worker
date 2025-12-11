import { createFileRoute, Link } from "@tanstack/react-router";
import type { TaskFilters } from "../features/task";
import EmployerPromoCard from "../features/employer/components/EmployerPromoCard";
import TaskerPromoCard from "../features/task/components/TaskerPromoCard";
import { TaskFilterPanel } from "../features/task/components/TaskFilterPanel";
import TaskList from "../features/task/components/TaskList";
import { useMemo, useState } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { taskQueries } from "../features/task/queries/taskQueries";
import EmployerNavBar from "../features/layoutcomponents/EmployerNavBar";

export const Route = createFileRoute("/")({
  loader: ({ context: { queryClient } }) => queryClient.ensureQueryData(taskQueries.all()),
  component: RouteComponent,
});

function RouteComponent() {
  const [filters, setFilters] = useState<TaskFilters>({
    status: "ACTIVE",
    sortBy: "newest",
  });

  const handleResetFilters = () => {
    setFilters({
      status: "ACTIVE",
      sortBy: "newest",
    });
  };

  const tasksQuery = useSuspenseQuery(taskQueries.all());
  const tasks = tasksQuery.data;

  const filteredTasks = useMemo(() => tasks?.content || [], [tasks]);

  return (
    <>
      <EmployerNavBar />
      <main className="container mx-auto px-6 py-12 grid gap-12">
        <section className="bg-white rounded-lg shadow-lg text-center py-16 px-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800">Saa enemmän aikaan WorkerAppilla!</h1>

          <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
            Löydä luotettavia tekijöitä arjen tehtäviin, pienistä korjauksista päivittäisten asioiden hoitamiseen. Luo
            tehtävä ja aloita heti.
          </p>
          <div className="mt-8 flex justify-center space-x-4 flex-wrap">
            <Link
              to="/employer/create-task"
              className="inline-flex h-12 w-44 items-center justify-center rounded-md bg-green-500 text-white hover:bg-green-600 font-medium"
            >
              Luo tehtävä
            </Link>

            <Link
              to="/worker/tasks"
              className="inline-flex h-12 w-44 items-center justify-center rounded-md bg-white border border-gray-300 hover:bg-gray-100 hover:border-green-400 font-medium"
            >
              Selaa tehtäviä
            </Link>
          </div>
        </section>

        <section className="grid gap-8">
          <div className="grid md:grid-cols-2 gap-8">
            <EmployerPromoCard />
            <TaskerPromoCard />
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Selaa tehtäviä</h2>
          <TaskFilterPanel filters={filters} onFiltersChange={setFilters} onReset={handleResetFilters} />
        </section>

        {<TaskList tasks={filteredTasks} />}
      </main>
    </>
  );
}
