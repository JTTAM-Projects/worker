import { useSearchParams } from "react-router-dom";
import TaskList from "../features/task/components/TaskList";
import { TaskFilterPanel } from "../features/task/components/TaskFilterPanel";
import { ResultsControlBar } from "../features/task/components/ResultsControlBar";
import { TaskMap } from "../features/task/components/TaskMap";
import type { TaskFilters, ViewMode } from "../features/task/types";
import { useTasks, useAllFilteredTasks } from "../features/task/hooks";
import { Pagination } from "../ui-library";
import {
  filtersToSearchParams,
  searchParamsToFilters,
  getViewMode,
  getPageNumber,
} from "../features/task/utils/urlState";

export default function TaskPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Parse state from URL (single source of truth)
  const filters = searchParamsToFilters(searchParams);
  const viewMode = getViewMode(searchParams);
  const page = getPageNumber(searchParams);

  // Fetch paginated tasks for list view
  const {
    data: taskPage,
    isLoading: isLoadingList,
    isError: isErrorList,
    error: listError,
  } = useTasks({
    page,
    size: 20,
    ...filters,
  });

  // Fetch all filtered tasks for map view (up to 1000)
  const {
    data: mapTasksPage,
    isLoading: isLoadingMap,
    isError: isErrorMap,
    error: mapError,
  } = useAllFilteredTasks(filters, {
    enabled: viewMode === "map", // Only fetch when in map view
  });

  const isLoading = viewMode === "list" ? isLoadingList : isLoadingMap;
  const isError = viewMode === "list" ? isErrorList : isErrorMap;
  const error = viewMode === "list" ? listError : mapError;
  const data = viewMode === "list" ? taskPage : mapTasksPage;

  // Update URL params with new filters
  const updateFilters = (newFilters: TaskFilters, resetPage = true) => {
    const newParams = filtersToSearchParams(
      newFilters,
      viewMode,
      resetPage ? 0 : page
    );
    setSearchParams(newParams);
  };

  // Update URL params with new view mode
  const updateViewMode = (newViewMode: ViewMode) => {
    const newParams = filtersToSearchParams(filters, newViewMode, page);
    setSearchParams(newParams);
  };

  // Update URL params with new page
  const updatePage = (newPage: number) => {
    const newParams = filtersToSearchParams(filters, viewMode, newPage);
    setSearchParams(newParams);
  };

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
    
    updateFilters(newFilters, true);
  };

  const handleResetFilters = () => {
    const resetFilters: TaskFilters = { 
      status: "ACTIVE",
      sortBy: "newest"
    };
    updateFilters(resetFilters, true);
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
          Virhe ladattaessa tehtäviä: {error?.message || "Tuntematon virhe"}
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
          onFiltersChange={(newFilters) => updateFilters(newFilters, true)}
          onReset={handleResetFilters}
        />

        {/* Results Control Bar */}
        {data && (
          <ResultsControlBar
            totalResults={data.totalElements}
            filters={filters}
            sortBy={filters.sortBy || 'newest'}
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
      ) : viewMode === 'list' ? (
        <TaskList tasks={data?.content || []} />
      ) : (
        <TaskMap
          tasks={mapTasksPage?.content || []}
          totalElements={mapTasksPage?.totalElements || 0}
          filters={filters}
          isLoading={isLoadingMap}
        />
      )}

      {viewMode === 'list' && data && data.totalPages > 1 && (
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
