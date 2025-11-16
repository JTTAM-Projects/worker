import type { TaskFilters, SortOption, ViewMode } from '../types';

interface ResultsControlBarProps {
  totalResults: number;
  filters: TaskFilters;
  sortBy: SortOption;
  viewMode: ViewMode;
  onSortChange: (sort: SortOption) => void;
  onViewModeChange: (mode: ViewMode) => void;
  onRemoveFilter: (filterKey: keyof TaskFilters, value?: string) => void;
}

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'newest', label: 'Uusin ensin' },
  { value: 'oldest', label: 'Vanhin ensin' },
  { value: 'priceAsc', label: 'Hinta: Halvin ensin' },
  { value: 'priceDesc', label: 'Hinta: Kallein ensin' },
  { value: 'nearest', label: 'Lähin minua' },
];

export function ResultsControlBar({
  totalResults,
  filters,
  sortBy,
  viewMode,
  onSortChange,
  onViewModeChange,
  onRemoveFilter,
}: ResultsControlBarProps) {
  
  const handleRemoveCategory = (category: string) => {
    onRemoveFilter('categories', category);
  };

  const handleRemovePrice = () => {
    onRemoveFilter('minPrice');
    onRemoveFilter('maxPrice');
  };

  const handleRemoveLocation = () => {
    onRemoveFilter('latitude');
    onRemoveFilter('longitude');
    onRemoveFilter('radiusKm');
  };

  const handleRemoveSearch = () => {
    onRemoveFilter('searchText');
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
      {/* Top Row: Results Count, Sort, View Toggle */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
        {/* Results Count */}
        <div className="text-gray-700 font-medium">
          Löytyi <span className="text-green-600 font-bold">{totalResults}</span> tehtävää
        </div>

        {/* Controls Group */}
        <div className="flex items-center gap-4">
          {/* Sort Dropdown */}
          <div className="flex items-center gap-2">
            <label htmlFor="sort-select" className="text-sm text-gray-600">
              Järjestä:
            </label>
            <select
              id="sort-select"
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value as SortOption)}
              className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
            >
              {SORT_OPTIONS.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* View Toggle */}
          <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
            <button
              onClick={() => onViewModeChange('list')}
              className={`flex items-center gap-1 px-3 py-1.5 text-sm font-medium transition-colors ${
                viewMode === 'list'
                  ? 'bg-green-500 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              <span className="material-icons text-sm">view_list</span>
              Lista
            </button>
            <button
              onClick={() => onViewModeChange('map')}
              className={`flex items-center gap-1 px-3 py-1.5 text-sm font-medium transition-colors border-l ${
                viewMode === 'map'
                  ? 'bg-green-500 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              <span className="material-icons text-sm">map</span>
              Kartta
            </button>
          </div>
        </div>
      </div>

      {/* Active Filter Pills */}
      {(filters.searchText || 
        (filters.categories && filters.categories.length > 0) || 
        filters.minPrice !== undefined || 
        filters.maxPrice !== undefined || 
        filters.latitude !== undefined) && (
        <div className="border-t border-gray-200 pt-3">
          <div className="flex items-start gap-2 flex-wrap">
            <span className="text-xs text-gray-500 font-medium py-1">
              Aktiiviset suodattimet:
            </span>
            
            {/* Search Text Pill */}
            {filters.searchText && (
              <button
                onClick={handleRemoveSearch}
                className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm hover:bg-green-200 transition-colors"
              >
                <span>Haku: "{filters.searchText}"</span>
                <span className="material-icons text-sm">close</span>
              </button>
            )}

            {/* Category Pills */}
            {filters.categories?.map(category => (
              <button
                key={category}
                onClick={() => handleRemoveCategory(category)}
                className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm hover:bg-green-200 transition-colors"
              >
                <span>{category}</span>
                <span className="material-icons text-sm">close</span>
              </button>
            ))}

            {/* Price Range Pill */}
            {(filters.minPrice !== undefined || filters.maxPrice !== undefined) && (
              <button
                onClick={handleRemovePrice}
                className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm hover:bg-green-200 transition-colors"
              >
                <span>
                  €{filters.minPrice || 0} - €{filters.maxPrice || '∞'}
                </span>
                <span className="material-icons text-sm">close</span>
              </button>
            )}

            {/* Location Pill */}
            {filters.latitude !== undefined && filters.longitude !== undefined && (
              <button
                onClick={handleRemoveLocation}
                className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm hover:bg-green-200 transition-colors"
              >
                <span className="material-icons text-xs">place</span>
                <span>{filters.radiusKm || 10} km säteellä</span>
                <span className="material-icons text-sm">close</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
