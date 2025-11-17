import { memo, useCallback } from 'react';
import type { TaskFilters } from '../types';
import { useFilterState } from '../hooks/useFilterState';
import { useGeocoding } from '../hooks/useGeocoding';
import { useGeolocation } from '../hooks/useGeolocation';
import { CategoryFilter } from './CategoryFilter';
import { PriceRangeInput } from './PriceRangeInput';
import { LocationSearchInput } from './LocationSearchInput';

interface TaskFilterPanelProps {
  filters: TaskFilters;
  onFiltersChange: (filters: TaskFilters) => void;
  onReset: () => void;
}

/**
 * TaskFilterPanel - A comprehensive filter panel for task search
 * 
 * This component provides a master search pattern where users can:
 * 1. Configure multiple filter criteria (text, categories, price, location)
 * 2. Trigger a single search with all filters applied at once
 * 
 * Architecture:
 * - Custom hooks for complex logic (useFilterState, useGeocoding, useGeolocation)
 * - Presentational components for UI sections (CategoryFilter, PriceRangeInput, LocationSearchInput)
 * - Master search button that applies all filters simultaneously
 * 
 * Features:
 * - Text search with Enter key support
 * - Multi-select category filtering
 * - Dual-handle price range slider with synchronized inputs
 * - Location search via Nominatim API or browser geolocation
 * - Radius-based location filtering (1-100 km)
 * 
 * @param filters - Current active filters from parent
 * @param onFiltersChange - Callback to update filters in parent state
 * @param onReset - Callback to reset all filters
 */
function TaskFilterPanelComponent({ filters, onFiltersChange, onReset }: TaskFilterPanelProps) {
  // Custom hooks for state and API interactions
  const filterState = useFilterState(filters);
  const { geocode, isLoading: isGeocodingLoading, error: geocodingError } = useGeocoding();
  const { getCurrentLocation, isLoading: isGeolocationLoading, error: geolocationError } = useGeolocation();

  const isLoadingLocation = isGeocodingLoading || isGeolocationLoading;
  const locationError = geocodingError || geolocationError;

  // Master search function that applies all filters at once
  const handleSearch = useCallback(async () => {
    // If there's location text that hasn't been geocoded yet, geocode it first
    const hasLocationText = filterState.state.locationSearch.trim();
    const hasLocationCoords = filters.latitude && filters.longitude;
    const locationTextChanged = hasLocationText && hasLocationText !== filters.locationText;
    
    if (hasLocationText && (!hasLocationCoords || locationTextChanged)) {
      // Geocode the location first
      const result = await geocode(filterState.state.locationSearch);
      if (result) {
        const newFilters = filterState.buildFilters({
          ...filters,
          latitude: result.latitude,
          longitude: result.longitude,
          radiusKm: filterState.state.radiusKm,
          locationText: filterState.state.locationSearch.trim()
        });
        onFiltersChange(newFilters);
      }
    } else {
      // No location text or already geocoded, just apply filters
      const newFilters = filterState.buildFilters(filters);
      onFiltersChange(newFilters);
    }
  }, [filterState, filters, onFiltersChange, geocode]);

  // Handle location geocoding
  const handleLocationSearch = useCallback(async () => {
    if (!filterState.state.locationSearch.trim()) {
      return;
    }

    const result = await geocode(filterState.state.locationSearch);
    if (result) {
      onFiltersChange({
        ...filters,
        latitude: result.latitude,
        longitude: result.longitude,
        radiusKm: filterState.state.radiusKm,
        locationText: filterState.state.locationSearch.trim()
      });
    }
  }, [filterState.state.locationSearch, filterState.state.radiusKm, geocode, filters, onFiltersChange]);

  // Handle current location request
  const handleCurrentLocation = useCallback(async () => {
    const result = await getCurrentLocation();
    if (result) {
      filterState.setLocationSearch('Nykyinen sijainti');
      onFiltersChange({
        ...filters,
        latitude: result.latitude,
        longitude: result.longitude,
        radiusKm: filterState.state.radiusKm,
        locationText: 'Nykyinen sijainti'
      });
    }
  }, [getCurrentLocation, filterState, filters, onFiltersChange]);

  // Handle reset
  const handleResetClick = useCallback(() => {
    filterState.reset();
    onReset();
  }, [filterState, onReset]);

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Suodattimet</h2>
        <button
          type="button"
          onClick={handleResetClick}
          className="px-4 py-2 text-sm bg-white text-green-600 border-2 border-green-500 rounded-lg hover:bg-green-50 hover:border-green-600 transition-colors font-medium"
        >
          <span className="material-icons text-sm align-middle mr-1">refresh</span>
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
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
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

      {/* Location */}
      <LocationSearchInput
        locationSearch={filterState.state.locationSearch}
        radiusKm={filterState.state.radiusKm}
        isLoading={isLoadingLocation}
        hasLocation={!!filters.latitude && !!filters.longitude}
        latitude={filters.latitude}
        longitude={filters.longitude}
        error={locationError}
        onLocationSearchChange={filterState.setLocationSearch}
        onLocationSearchSubmit={handleLocationSearch}
        onCurrentLocationClick={handleCurrentLocation}
        onRadiusChange={filterState.setRadiusKm}
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

// Memoize the component to prevent unnecessary re-renders
const TaskFilterPanelMemoized = memo(TaskFilterPanelComponent, (prevProps, nextProps) => {
  // Only re-render if filters actually changed (deep comparison of filter values)
  return (
    prevProps.filters.searchText === nextProps.filters.searchText &&
    prevProps.filters.minPrice === nextProps.filters.minPrice &&
    prevProps.filters.maxPrice === nextProps.filters.maxPrice &&
    prevProps.filters.latitude === nextProps.filters.latitude &&
    prevProps.filters.longitude === nextProps.filters.longitude &&
    prevProps.filters.radiusKm === nextProps.filters.radiusKm &&
    JSON.stringify(prevProps.filters.categories) === JSON.stringify(nextProps.filters.categories) &&
    prevProps.onFiltersChange === nextProps.onFiltersChange &&
    prevProps.onReset === nextProps.onReset
  );
});

TaskFilterPanelMemoized.displayName = 'TaskFilterPanel';

export { TaskFilterPanelMemoized as TaskFilterPanel };
