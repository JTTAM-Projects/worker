import { createFileRoute, redirect, useNavigate, useSearch } from "@tanstack/react-router";
import { useEffect } from "react";
import { z } from "zod";
import type { TaskFilters, ViewMode } from "../../../../features/task";
import { taskQueries } from "../../../../features/task/queries/taskQueries";
import { useQuery } from "@tanstack/react-query";
import { TaskFilterPanel } from "../../../../features/task/components/TaskFilterPanel";
import { ResultsControlBar } from "../../../../features/task/components/ResultsControlBar";
import TaskList from "../../../../features/task/components/TaskList";
import { TaskMap } from "../../../../features/task/components/TaskMap";
import { Pagination } from "../../../../ui-library";

const taskSearchSchema = z.object({
  page: z.number().optional(),
  view: z.enum(["list", "map"]).optional(),
  status: z.string().optional(),
  sortBy: z.string().optional(),
  searchText: z.string().optional(),
  categories: z.array(z.string()).optional(),
  minPrice: z.number().optional(),
  maxPrice: z.number().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  radiusKm: z.number().optional(),
  locationText: z.string().optional(),
});

export const Route = createFileRoute("/_authenticated/worker/tasks/")({
  component: TaskListPage,
  validateSearch: taskSearchSchema,
  beforeLoad: ({ search }) => {
    // If URL has no search params, try to restore from sessionStorage
    if (Object.keys(search).length === 0) {
      try {
        const saved = sessionStorage.getItem("worker-tasks-search");
        if (saved) {
          const parsed = JSON.parse(saved);
          // Redirect to the same route with saved search params
          throw redirect({
            to: "/worker/tasks",
            search: parsed,
            replace: true,
          });
        }
      } catch (error) {
        // If it's not a redirect, ignore the error
        if (error instanceof Error && error.message === "REACT_ROUTER_REDIRECT") {
          throw error;
        }
      }
    }
  },
});

function TaskListPage() {
  const navigate = useNavigate({ from: "/worker/tasks" });
  const search = useSearch({ from: "/_authenticated/worker/tasks/" });

  // Save search params to sessionStorage whenever they change
  useEffect(() => {
    if (Object.keys(search).length > 0) {
      sessionStorage.setItem("worker-tasks-search", JSON.stringify(search));
    }
  }, [search]);

  // Build filters from search params with defaults
  const filters: TaskFilters = {
    status: (search.status as TaskFilters["status"]) ?? "ACTIVE",
    sortBy: (search.sortBy as TaskFilters["sortBy"]) ?? "newest",
    searchText: search.searchText,
    categories: search.categories,
    minPrice: search.minPrice,
    maxPrice: search.maxPrice,
    latitude: search.latitude,
    longitude: search.longitude,
    radiusKm: search.radiusKm,
    locationText: search.locationText,
  };

  const viewMode: ViewMode = search.view ?? "list";
  const page = search.page ?? 0;

  // Fetch paginated tasks for list view
  const { data: taskPage } = useQuery(
    taskQueries.all({
      page,
      size: 20,
      ...filters,
    })
  );

  // Fetch all filtered tasks for map view (up to 1000)
  const { data: mapTasksPage, isLoading: isLoadingMap } = useQuery({
    ...taskQueries.allFiltered(filters),
    enabled: viewMode === "map", // Only fetch when in map view
  });

  const data = viewMode === "list" ? taskPage : mapTasksPage;

  // Update filters and reset to page 0
  const updateFilters = (newFilters: TaskFilters, resetPage = true) => {
    navigate({
      search: {
        ...search,
        ...newFilters,
        page: resetPage ? 0 : search.page,
      },
    });
  };

  // Update view mode
  const updateViewMode = (newViewMode: ViewMode) => {
    navigate({
      search: {
        ...search,
        view: newViewMode,
      },
    });
  };

  // Update page
  const updatePage = (newPage: number) => {
    navigate({
      search: {
        ...search,
        page: newPage,
      },
    });
  };

  const handleRemoveFilter = (filterKey: keyof TaskFilters, value?: string) => {
    const newSearch = { ...search };

    if (filterKey === "categories" && value) {
      // Remove specific category
      newSearch.categories = search.categories?.filter((c) => c !== value);
      if (newSearch.categories?.length === 0) {
        delete newSearch.categories;
      }
    } else if (filterKey === "minPrice" || filterKey === "maxPrice") {
      // Remove both price filters
      delete newSearch.minPrice;
      delete newSearch.maxPrice;
    } else if (filterKey === "latitude" || filterKey === "longitude") {
      // Remove location filters
      delete newSearch.latitude;
      delete newSearch.longitude;
      delete newSearch.radiusKm;
      delete newSearch.locationText;
    } else {
      // Remove single filter
      delete newSearch[filterKey as keyof typeof newSearch];
    }

    navigate({
      search: {
        ...newSearch,
        page: 0,
      },
    });
  };

  const handleResetFilters = () => {
    navigate({
      search: {
        page: 0,
        view: search.view,
        status: "ACTIVE",
        sortBy: "newest",
      },
    });
  };

  const hasNoResults = data && data.content.length === 0;

  return (
    <main className="container mx-auto px-6 py-12 grid gap-12 pt-10 pb-20">
      <section className="grid gap-6">
        <h1 className="text-4xl font-bold text-gray-800">Selaa tehtäviä</h1>

        <TaskFilterPanel
          filters={filters}
          onFiltersChange={(newFilters) => updateFilters(newFilters, true)}
          onReset={handleResetFilters}
        />

        {/* Results Control Bar */}
        {data && (
          <ResultsControlBar
            totalResults={data.totalElements}
            filters={filters}
            sortBy={filters.sortBy || "newest"}
            viewMode={viewMode}
            onSortChange={(sort) => updateFilters({ ...filters, sortBy: sort }, true)}
            onViewModeChange={updateViewMode}
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
        <TaskMap
          tasks={mapTasksPage?.content || []}
          totalElements={mapTasksPage?.totalElements || 0}
          filters={filters}
          isLoading={isLoadingMap}
        />
      )}

      {viewMode === "list" && data && data.totalPages > 1 && (
        <Pagination
          currentPage={page}
          totalPages={data.totalPages}
          onPageChange={updatePage}
          onPrevious={() => updatePage(page - 1)}
          onNext={() => updatePage(page + 1)}
          zeroIndexed={true}
        />
      )}
    </main>
  );
}
