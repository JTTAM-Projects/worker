import { useMemo, useState } from "react";
import EmployerPromoCard from "../features/employer/components/EmployerPromoCard";
import { TaskFilterPanel } from "../features/task/components/TaskFilterPanel";
import TaskList from "../features/task/components/TaskList";
import TaskerPromoCard from "../features/task/components/TaskerPromoCard";
import type { TaskFilters } from "../features/task/types";
import { useTasks } from "../features/task/hooks/useTasks";
import { Link } from "react-router-dom";
import CreateTask from "../features/task/components/CreateTask";

export default function LandingPage() {
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

  const { data, isLoading, error } = useTasks({
    page: 0,
    size: 12,
    ...filters,
  });

  const filteredTasks = useMemo(() => data?.content || [], [data]);

  return (
    <main className="container mx-auto px-6 py-12 grid gap-12">
      <section className="bg-white rounded-lg shadow-lg text-center py-16 px-8">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800">
          Saa enemmän aikaan WorkerAppilla!
        </h1>

        <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
          Löydä luotettavia tekijöitä arjen tehtäviin, pienistä korjauksista
          päivittäisten asioiden hoitamiseen. Luo tehtävä ja aloita heti.
        </p>
        <div className="mt-8 flex justify-center space-x-4 flex-wrap">
          <CreateTask>
            <Link
              to="#"
              onClick={(e) => e.preventDefault()}
              className="inline-flex h-12 w-44 items-center justify-center rounded-md bg-green-500 text-white hover:bg-green-600 font-medium"
            >
              Luo tehtävä
            </Link>
          </CreateTask>

          <Link
            to="/tasks"
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
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Selaa tehtäviä
        </h2>
        <TaskFilterPanel 
          filters={filters} 
          onFiltersChange={setFilters}
          onReset={handleResetFilters}
        />
      </section>

      {isLoading && (
        <div className="text-center py-8">
          <p className="text-gray-600">Ladataan tehtäviä...</p>
        </div>
      )}

      {error && (
        <div className="text-center py-8">
          <p className="text-red-600">
            Virhe tehtävien lataamisessa. Yritä uudelleen myöhemmin.
          </p>
        </div>
      )}

      {!isLoading && !error && <TaskList tasks={filteredTasks} />}
    </main>
  );
}
