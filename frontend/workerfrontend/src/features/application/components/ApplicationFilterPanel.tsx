import { memo, useCallback } from "react";
import type { ApplicationFilters } from "../types";
import { useApplicationFilterState } from "../hooks/useApplicationFilterState";
import { PriceRangeInput } from "../../task/components/PriceRangeInput";
import { CategoryFilter } from "../../task/components/CategoryFilter";

interface ApplicationFilterPanelProps {
  filters: ApplicationFilters;
  onFiltersChange: (filters: ApplicationFilters) => void;
  onReset: () => void;
}

// Filter panel for user's application list with text search, category selection, and price range inputs.
// Uses useApplicationFilterState hook for managing filter state and provides reset functionality.
function ApplicationFilterPanelComponent({
  filters,
  onFiltersChange,
  onReset,
}: ApplicationFilterPanelProps) {
  const filterState = useApplicationFilterState(filters);

  const handleSearch = useCallback(() => {
    const newFilters = filterState.buildFilters(filters);
    onFiltersChange(newFilters);
  }, [filterState, filters, onFiltersChange]);

  const handleReset = useCallback(() => {
    filterState.reset();
    onReset();
  }, [filterState, onReset]);

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Suodattimet</h2>
        <button
          type="button"
          onClick={handleReset}
          className="px-4 py-2 text-sm bg-white text-green-600 border-2 border-green-500 rounded-lg hover:bg-green-50 hover:border-green-600 transition-colors font-medium"
        >
          <span className="material-icons text-sm align-middle mr-1">
            refresh
          </span>
          Nollaa suodattimet
        </button>
      </div>

      {/* Text Search */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Tekstihaku
        </label>
        <input
          type="text"
          value={filterState.state.searchText}
          onChange={(e) => filterState.setSearchText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          placeholder="Etsi otsikosta tai kuvauksesta..."
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
        />
      </div>

      {/* Categories */}
      <CategoryFilter
        selectedCategories={filterState.state.selectedCategories}
        onToggle={filterState.toggleCategory}
      />

      {/* Price Range */}
      <PriceRangeInput
        minPrice={filterState.state.minPrice}
        maxPrice={filterState.state.maxPrice}
        minPriceSlider={filterState.state.minPriceSlider}
        maxPriceSlider={filterState.state.maxPriceSlider}
        onMinPriceChange={filterState.setMinPrice}
        onMaxPriceChange={filterState.setMaxPrice}
        onMinSliderChange={filterState.setMinPriceSlider}
        onMaxSliderChange={filterState.setMaxPriceSlider}
      />

      {/* Master Search Button */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <button
          type="button"
          onClick={handleSearch}
          className="w-full px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium text-lg shadow-md hover:shadow-lg"
        >
          <span className="material-icons align-middle mr-2">search</span>
          Hae tehtäviä
        </button>
      </div>
    </div>
  );
}

const ApplicationFilterPanelMemoized = memo(
  ApplicationFilterPanelComponent,
  (prevProps, nextProps) => {
    return (
      prevProps.filters?.searchText === nextProps.filters?.searchText &&
      prevProps.filters?.minPrice === nextProps.filters?.minPrice &&
      prevProps.filters?.maxPrice === nextProps.filters?.maxPrice &&
      JSON.stringify(prevProps.filters?.categories) ===
        JSON.stringify(nextProps.filters?.categories) &&
      prevProps.onFiltersChange === nextProps.onFiltersChange &&
      prevProps.onReset === nextProps.onReset
    );
  }
);

ApplicationFilterPanelMemoized.displayName = "ApplicationFilterPanel";

export { ApplicationFilterPanelMemoized as ApplicationFilterPanel };
