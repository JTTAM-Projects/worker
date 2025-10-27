import { useState } from "react";
import TaskList from "../features/task/components/TaskList";
import { TaskFilterPanel } from "../features/task/components/TaskFilterPanel";
import { ResultsControlBar } from "../features/task/components/ResultsControlBar";
import type { TaskFilters, ViewMode } from "../features/task/types";
import { useTasks } from "../features/task/hooks/useTasks";
import { Pagination } from "../ui-library";

export default function TaskPage() {
  const [page, setPage] = useState(0);
  const [filters, setFilters] = useState<TaskFilters>({
    status: "ACTIVE", // Only show active tasks by default
    sortBy: "newest",
  });
  const [viewMode, setViewMode] = useState<ViewMode>("list");

  const { data, isLoading, isError, error } = useTasks({
    page,
    size: 20,
    ...filters,
  });

  const handleRemoveFilter = (filterKey: keyof TaskFilters, value?: string) => {
    const newFilters = { ...filters };
    
    if (filterKey === 'categories' && value) {
      // Remove specific category
      newFilters.categories = filters.categories?.filter(c => c !== value);
      if (newFilters.categories?.length === 0) {
        delete newFilters.categories;
      }
    } else if (filterKey === 'minPrice' || filterKey === 'maxPrice') {
      // Remove both price filters
      delete newFilters.minPrice;
      delete newFilters.maxPrice;
    } else if (filterKey === 'latitude' || filterKey === 'longitude') {
      // Remove location filters
      delete newFilters.latitude;
      delete newFilters.longitude;
      delete newFilters.radiusKm;
    } else {
      // Remove single filter
      delete newFilters[filterKey];
    }
    
    setFilters(newFilters);
    setPage(0);
  };

  const handleResetFilters = () => {
    const resetFilters: TaskFilters = { 
      status: "ACTIVE",
      sortBy: "newest"
    };
    setFilters(resetFilters);
    setPage(0);
  };

  if (isLoading) {
    return (
      <main className="container mx-auto px-6 py-12 grid gap-12 pt-10 pb-20">
        <div className="text-center text-gray-600">Ladataan tehtäviä...</div>
      </main>
    );
  }

  if (isError) {
    return (
      <main className="container mx-auto px-6 py-12 grid gap-12 pt-10 pb-20">
        <div className="text-center text-red-600">
          Virhe ladattaessa tehtäviä: {error.message}
        </div>
      </main>
    );
  }

  const hasNoResults = data && data.content.length === 0;

  return (
    <main className="container mx-auto px-6 py-12 grid gap-12 pt-10 pb-20">
      <section className="grid gap-6">
        <h1 className="text-4xl font-bold text-gray-800">Selaa tehtäviä</h1>
        
        <TaskFilterPanel
          filters={filters}
          onFiltersChange={(newFilters) => {
            setFilters(newFilters);
            setPage(0); // Reset to first page when filters change
          }}
          onReset={handleResetFilters}
        />

        {/* Results Control Bar */}
        {data && (
          <ResultsControlBar
            totalResults={data.totalElements}
            filters={filters}
            sortBy={filters.sortBy || 'newest'}
            viewMode={viewMode}
            onSortChange={(sort) => {
              setFilters({ ...filters, sortBy: sort });
              setPage(0);
            }}
            onViewModeChange={setViewMode}
            onRemoveFilter={handleRemoveFilter}
          />
        )}
      </section>

      {hasNoResults ? (
        <section className="bg-white rounded-lg shadow-lg p-6 md:p-8">
          <div className="text-center text-gray-600 py-12 max-w-4xl mx-auto">
            <span className="material-icons text-gray-400 text-6xl mb-4">search_off</span>
            <p className="text-xl font-semibold mb-2">Ei tuloksia</p>
            <p>Yhtään tehtävää ei löytynyt valituilla suodattimilla.</p>
            <button
              onClick={handleResetFilters}
              className="mt-4 px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium"
            >
              Tyhjennä suodattimet
            </button>
          </div>
        </section>
      ) : viewMode === 'list' ? (
        <TaskList tasks={data?.content || []} />
      ) : (
        <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
          <div className="text-center text-gray-600 py-12">
            <span className="material-icons text-gray-400 text-6xl mb-4">map</span>
            <p className="text-xl font-semibold mb-2">Karttanäkymä</p>
            <p>Karttanäkymä tulossa pian...</p>
          </div>
        </div>
      )}

      {data && data.totalPages > 1 && (
        <Pagination
          currentPage={page}
          totalPages={data.totalPages}
          onPageChange={(newPage) => setPage(newPage)}
          onPrevious={() => setPage(page - 1)}
          onNext={() => setPage(page + 1)}
          zeroIndexed={true}
        />
      )}
    </main>
  );
}
