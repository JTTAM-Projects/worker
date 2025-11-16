import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import type { TaskFilters, ViewMode } from "../../../../features/task/types";
import { useTasks } from "../../../../features/task/hooks/useTasks";
import { TaskFilterPanel } from "../../../../features/task/components/TaskFilterPanel";
import { ResultsControlBar } from "../../../../features/task/components/ResultsControlBar";
import TaskList from "../../../../features/task/components/TaskList";
import Pagination from "../../../../ui-library/Pagination";

const FILTER_STORAGE_KEY = "taskPageFilters";
const PAGE_STORAGE_KEY = "taskPageNumber";

export const Route = createFileRoute("/_authenticated/worker/tasks/")({
  component: TaskPage,
});

function loadFiltersFromStorage(): TaskFilters {
  try {
    const stored = sessionStorage.getItem(FILTER_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error("Failed to load filters from storage:", error);
  }
  // Default filters
  return {
    status: "ACTIVE",
    sortBy: "newest",
  };
}

/**
 * Save filters to sessionStorage
 */
function saveFiltersToStorage(filters: TaskFilters): void {
  try {
    sessionStorage.setItem(FILTER_STORAGE_KEY, JSON.stringify(filters));
  } catch (error) {
    console.error("Failed to save filters to storage:", error);
  }
}

/**
 * Load page number from sessionStorage
 */
function loadPageFromStorage(): number {
  try {
    const stored = sessionStorage.getItem(PAGE_STORAGE_KEY);
    if (stored) {
      return parseInt(stored, 10);
    }
  } catch (error) {
    console.error("Failed to load page from storage:", error);
  }
  return 0;
}

/**
 * Save page number to sessionStorage
 */
function savePageToStorage(page: number): void {
  try {
    sessionStorage.setItem(PAGE_STORAGE_KEY, page.toString());
  } catch (error) {
    console.error("Failed to save page to storage:", error);
  }
}

export default function TaskPage() {
  const [page, setPage] = useState(loadPageFromStorage);
  const [filters, setFilters] = useState<TaskFilters>(loadFiltersFromStorage);
  const [viewMode, setViewMode] = useState<ViewMode>("list");

  // Save filters to sessionStorage whenever they change
  useEffect(() => {
    saveFiltersToStorage(filters);
  }, [filters]);

  // Save page to sessionStorage whenever it changes
  useEffect(() => {
    savePageToStorage(page);
  }, [page]);

  const { data, isLoading, isError, error } = useTasks({
    page,
    size: 20,
    ...filters,
  });

  const handleRemoveFilter = (filterKey: keyof TaskFilters, value?: string) => {
    const newFilters = { ...filters };

    if (filterKey === "categories" && value) {
      // Remove specific category
      newFilters.categories = filters.categories?.filter((c) => c !== value);
      if (newFilters.categories?.length === 0) {
        delete newFilters.categories;
      }
    } else if (filterKey === "minPrice" || filterKey === "maxPrice") {
      // Remove both price filters
      delete newFilters.minPrice;
      delete newFilters.maxPrice;
    } else if (filterKey === "latitude" || filterKey === "longitude") {
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
      sortBy: "newest",
    };
    setFilters(resetFilters);
    setPage(0);
    // Clear storage when explicitly resetting
    sessionStorage.removeItem(FILTER_STORAGE_KEY);
    sessionStorage.removeItem(PAGE_STORAGE_KEY);
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
        <div className="text-center text-red-600">Virhe ladattaessa tehtäviä: {error.message}</div>
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
            sortBy={filters.sortBy || "newest"}
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
      ) : viewMode === "list" ? (
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
