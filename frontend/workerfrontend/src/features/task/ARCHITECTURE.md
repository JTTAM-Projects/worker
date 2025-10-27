# TaskFilterPanel Architecture Diagram

## Component Hierarchy

```
┌─────────────────────────────────────────────────────────────────┐
│                         TaskPage.tsx                            │
│  - Manages global filter state                                 │
│  - Uses useTasks() with TanStack Query                         │
│  - Handles pagination                                            │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                    TaskFilterPanel.tsx                          │
│  - Orchestrates hooks and components                            │
│  - Handles master search logic                                  │
│  - Coordinates filter submission                                │
└─────┬────────┬────────┬────────────────┬───────────────────────┘
      │        │        │                │
      │        │        │                │
      ▼        ▼        ▼                ▼
┌──────────┐  ┌──────────────┐  ┌──────────────────┐
│  Custom  │  │ Presentational│  │  API/Browser     │
│  Hooks   │  │  Components   │  │  Integration     │
└──────────┘  └──────────────┘  └──────────────────┘
```

## Detailed Architecture

```
TaskFilterPanel (Main Component)
├── Hooks (Business Logic)
│   ├── useFilterState
│   │   ├── State management (8 state values)
│   │   ├── State setters (memoized)
│   │   ├── buildFilters() - Create API payload
│   │   ├── syncWithFilters() - Handle external updates
│   │   └── reset() - Clear all state
│   │
│   ├── useGeocoding
│   │   ├── geocode() - Nominatim API call
│   │   ├── isLoading state
│   │   └── error state
│   │
│   └── useGeolocation
│       ├── getCurrentLocation() - Browser API
│       ├── isLoading state
│       └── error state
│
└── Components (Presentation)
    ├── CategoryFilter
    │   ├── Grid layout (2-5 columns responsive)
    │   ├── Checkbox + Icon + Label
    │   └── Toggle handler
    │
    ├── PriceRangeInput
    │   ├── Dual number inputs
    │   ├── Dual-handle slider
    │   ├── Tick marks (€0-€500)
    │   └── Synchronized state
    │
    └── LocationSearchInput
        ├── Text input for city/address
        ├── Current location button
        ├── Radius slider (1-100 km)
        ├── Error display
        └── Coordinates display
```

## Data Flow

### 1. User Interaction Flow
```
User types in filter
        ↓
Local state updates (useFilterState)
        ↓
User clicks "Hae tehtäviä"
        ↓
buildFilters() creates filter object
        ↓
onFiltersChange() callback to parent
        ↓
TaskPage updates filters state
        ↓
useTasks() refetches with new queryKey
        ↓
TanStack Query fetches from API
        ↓
UI updates with new results
```

### 2. Location Search Flow
```
User types city name
        ↓
User presses Enter
        ↓
useGeocoding.geocode() called
        ↓
Fetch from Nominatim API
        ↓
Parse lat/lon from response
        ↓
onFiltersChange() with coordinates
        ↓
Display "Sijainti asetettu"
        ↓
User clicks "Hae tehtäviä"
        ↓
Coordinates included in search
```

### 3. Current Location Flow
```
User clicks location icon
        ↓
useGeolocation.getCurrentLocation()
        ↓
Browser geolocation permission prompt
        ↓
Get coordinates from browser
        ↓
onFiltersChange() with coordinates
        ↓
Display "Sijainti asetettu"
```

## Hook Responsibilities

### useFilterState
```typescript
Input:  TaskFilters (from parent)
Output: {
  state: FilterState,        // Current form values
  setters: Function[],       // Update individual fields
  toggleCategory: Function,  // Toggle category selection
  buildFilters: Function,    // Transform to API format
  syncWithFilters: Function, // Handle external updates
  reset: Function            // Clear everything
}
```

### useGeocoding
```typescript
Input:  location string (e.g., "Helsinki")
Output: {
  geocode: (location) => Promise<{lat, lon}>,
  isLoading: boolean,
  error: string | null
}
```

### useGeolocation
```typescript
Input:  none
Output: {
  getCurrentLocation: () => Promise<{lat, lon}>,
  isLoading: boolean,
  error: string | null
}
```

## Component Props

### CategoryFilter
```typescript
Props: {
  selectedCategories: string[],
  onToggle: (category: string) => void
}
```

### PriceRangeInput
```typescript
Props: {
  minPrice: string,
  maxPrice: string,
  minPriceSlider: number,
  maxPriceSlider: number,
  onMinPriceChange: (value: string) => void,
  onMaxPriceChange: (value: string) => void,
  onMinSliderChange: (value: number) => void,
  onMaxSliderChange: (value: number) => void
}
```

### LocationSearchInput
```typescript
Props: {
  locationSearch: string,
  radiusKm: number,
  isLoading: boolean,
  hasLocation: boolean,
  latitude?: number,
  longitude?: number,
  error?: string | null,
  onLocationSearchChange: (value: string) => void,
  onLocationSearchSubmit: () => void,
  onCurrentLocationClick: () => void,
  onRadiusChange: (value: number) => void
}
```

## State Ownership

### Local State (TaskFilterPanel + useFilterState)
- searchText
- selectedCategories
- minPrice / maxPrice
- minPriceSlider / maxPriceSlider
- locationSearch
- radiusKm

### Parent State (TaskPage)
- filters (complete TaskFilters object)
- page (pagination)
- viewMode (list/map)

### TanStack Query Cache
- tasks data
- loading states
- error states
- stale time (5 minutes)

## Performance Optimizations

1. **React.memo** on all presentational components
2. **useCallback** for all event handlers
3. **Custom comparison** function for TaskFilterPanel memoization
4. **State batching** - single master search instead of multiple updates
5. **Conditional rendering** - location info only shown when available

## Testing Strategy

### Unit Tests (Hooks)
```
useFilterState
  ✓ initializes with default values
  ✓ updates individual fields
  ✓ toggles categories correctly
  ✓ builds filters object correctly
  ✓ syncs with external changes
  ✓ resets all values

useGeocoding
  ✓ fetches coordinates successfully
  ✓ handles API errors
  ✓ handles empty results
  ✓ sets loading state correctly

useGeolocation
  ✓ gets current position
  ✓ handles permission denied
  ✓ handles unsupported browser
```

### Component Tests (Presentational)
```
CategoryFilter
  ✓ renders all categories
  ✓ calls onToggle on click
  ✓ shows selected state
  ✓ displays correct count

PriceRangeInput
  ✓ syncs inputs with sliders
  ✓ prevents invalid ranges
  ✓ shows tick marks
  ✓ updates on slider drag

LocationSearchInput
  ✓ calls submit on Enter
  ✓ calls current location
  ✓ displays error message
  ✓ shows coordinates when set
```

### Integration Tests (Main Component)
```
TaskFilterPanel
  ✓ submits all filters on search
  ✓ resets all filters on reset
  ✓ geocodes location correctly
  ✓ uses current location
  ✓ prevents duplicate searches
```

## File Structure

```
src/features/task/
├── components/
│   ├── TaskFilterPanel.tsx          (Main orchestrator - 164 lines)
│   ├── CategoryFilter.tsx           (Presentational - 58 lines)
│   ├── PriceRangeInput.tsx         (Presentational - 131 lines)
│   └── LocationSearchInput.tsx     (Presentational - 80 lines)
├── hooks/
│   ├── useFilterState.ts           (State logic - 169 lines)
│   ├── useGeocoding.ts             (API integration - 68 lines)
│   ├── useGeolocation.ts           (Browser API - 56 lines)
│   └── index.ts                     (Hook exports)
└── REFACTORING_NOTES.md            (Documentation)
```

Total: **726 lines** distributed across **7 focused files**
Previously: **435 lines** in **1 monolithic file**

## Benefits Summary

| Aspect | Before | After |
|--------|--------|-------|
| Files | 1 | 7 |
| Lines per file | 435 | ~100 avg |
| Hook reusability | 0% | 100% |
| Component reusability | 0% | 100% |
| Test isolation | Hard | Easy |
| State management | Scattered | Centralized |
| API calls | Inline | Abstracted |
| Performance | Limited memoization | Fully optimized |
| Type safety | Partial | Complete |
