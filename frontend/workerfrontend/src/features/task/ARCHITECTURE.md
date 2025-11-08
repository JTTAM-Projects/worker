# Task Feature Module Architecture

## Overview

The Task feature module provides comprehensive task browsing, filtering, and management capabilities with advanced filtering, pagination, dual view modes (list/map), state persistence via URL parameters, and Google Maps integration for geospatial task discovery.

## Component Hierarchy

```
┌─────────────────────────────────────────────────────────────────┐
│                     Pages (Route Level)                         │
├─────────────────────────────────────────────────────────────────┤
│  TaskPage.tsx          - Main task browsing with dual views     │
│  LandingPage.tsx       - Homepage with task preview             │
│  TaskDetailPage.tsx    - Single task view                       │
│  OwnTaskDetailPage.tsx - Task owner's detail view               │
│  MyTasksPage.tsx       - User's own tasks                       │
└────────────────────────┬───────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                 Core Components Layer                           │
├─────────────────────────────────────────────────────────────────┤
│  TaskFilterPanel       - Advanced filtering interface           │
│  ResultsControlBar     - Active filters + sort + view toggle    │
│  TaskList              - Two-column card layout (list view)     │
│  TaskMap               - Google Maps with clustering (map view) │
│  TaskMapInfoWindow     - Marker popup with task details         │
│  Pagination            - Page navigation controls (list only)   │
└─────┬────────┬────────┬────────────────┬───────────────────────┘
      │        │        │                │
      │        │        │                │
      ▼        ▼        ▼                ▼
┌──────────┐  ┌──────────────┐  ┌──────────────────┐
│  Custom  │  │ Presentational│  │  State & API     │
│  Hooks   │  │  Components   │  │  Integration     │
└──────────┘  └──────────────┘  └──────────────────┘
```

## Detailed Architecture

```
Task Feature Module
├── Pages (Route Components)
│   ├── TaskPage.tsx (Main Browse Page)
│   │   ├── URL-based state management (single source of truth)
│   │   ├── Dual data fetching (paginated for list, all for map)
│   │   ├── View mode toggle (list/map)
│   │   ├── Filter coordination
│   │   └── Coordinates: TaskFilterPanel, ResultsControlBar, TaskList/TaskMap, Pagination
│   │
│   ├── LandingPage.tsx
│   │   ├── Simplified filter state
│   │   ├── Limited results (12 tasks)
│   │   └── Coordinates: TaskFilterPanel, TaskList
│   │
│   ├── TaskDetailPage.tsx
│   │   ├── Single task view
│   │   ├── Application submission
│   │   └── Uses: TaskDetails, ApplicationForm
│   │
│   ├── OwnTaskDetailPage.tsx
│   │   ├── Task owner's view
│   │   ├── Application management
│   │   └── Uses: TaskDetails, ApplicationsList
│   │
│   └── MyTasksPage.tsx
│       ├── User's created tasks
│       └── Uses: TaskList
│
├── Core Components
│   ├── TaskFilterPanel.tsx (Filter Orchestrator)
│   │   ├── Manages filter form state via useFilterState
│   │   ├── Geocoding integration (location → coordinates)
│   │   ├── Geolocation integration (browser GPS)
│   │   ├── Master search pattern (single search button)
│   │   └── Children: CategoryFilter, PriceRangeInput, LocationSearchInput
│   │
│   ├── ResultsControlBar.tsx
│   │   ├── Active filter chips (removable)
│   │   ├── Sort dropdown (newest, oldest, priceAsc, priceDesc, nearest)
│   │   ├── View mode toggle (list/map with icons)
│   │   └── Results count display with warning for capped results
│   │
│   ├── TaskList.tsx (List View)
│   │   ├── Two-column responsive grid layout
│   │   ├── Square image area (160px) with category icon overlay
│   │   ├── Three content zones:
│   │   │   - Title + Price (€)
│   │   │   - Location (city) + Date
│   │   │   - Poster avatar + username
│   │   └── Color-coded category backgrounds
│   │
│   ├── TaskMap.tsx (Map View)
│   │   ├── Google Maps integration (@react-google-maps/api)
│   │   ├── MarkerClusterer for performance (maxZoom: 14, gridSize: 40)
│   │   ├── Circle overlay for radius visualization
│   │   ├── Automatic bounds fitting or center on location filter
│   │   ├── Reactive updates on filter changes
│   │   ├── Task limit warning (max 1000 tasks)
│   │   ├── Stats display (mappable vs unmappable tasks)
│   │   └── Stacked markers handling (multiple tasks at same coordinates)
│   │
│   ├── TaskMapInfoWindow.tsx
│   │   ├── Popup on marker click
│   │   ├── Displays single or multiple tasks (stacked markers)
│   │   ├── Scrollable container (max-h-96) for many tasks
│   │   ├── Task preview: title, price, categories, city, description
│   │   ├── "Näytä tiedot" link to full task details
│   │   └── Task count header when multiple tasks at location
│   │
│   └── Pagination.tsx
│       ├── First/Previous/Next/Last navigation
│       ├── Page number display (1-indexed for UI)
│       └── Total pages info
│
├── Filter Components (Presentational)
│   ├── CategoryFilter.tsx
│   │   ├── Responsive grid layout (2-5 columns)
│   │   ├── Checkbox + Icon + Label for each category
│   │   ├── 10 categories: Cleaning, Garden, Moving, Other, Yard,
│   │   │   Forest work, Household, Repair, Painting, Snow removal
│   │   └── Toggle handler
│   │
│   ├── PriceRangeInput.tsx
│   │   ├── Dual number inputs (text fields)
│   │   ├── Dual-handle slider (0-500 range)
│   │   ├── Tick marks (€0-€500)
│   │   ├── Input validation and clamping
│   │   └── Synchronized input/slider state
│   │
│   └── LocationSearchInput.tsx
│       ├── Text input for city/address search
│       ├── Geocoding on Enter key or search button
│       ├── Current location button (geolocation API)
│       ├── Radius slider (1-100 km)
│       ├── Error display
│       └── Coordinates display when set
│
└── Other Components
    ├── TaskDetails.tsx - Detailed task information display
    ├── ApplicationForm.tsx - Apply to task form
    ├── ApplicationsList.tsx - List of task applications
    ├── ApplicationDetailsModal.tsx - Application detail modal
    ├── CreateTask.tsx - Task creation modal/form
    ├── TaskWizardForm.tsx - Multi-step task creation wizard
    ├── TaskApplyButtonActions.tsx - Task application actions
    ├── TaskerPromoCard.tsx - Marketing card for taskers
    ├── TaskFilter.tsx - (Legacy) Simple category filter
    └── SearchBar.tsx - Quick text search input
```

## Data Flow

### 1. URL-Based State Management Flow

```
Page loads
        ↓
Parse URL searchParams
        ↓
Extract filters, viewMode, page
        ↓
Pass to components as props
        ↓
User interacts with filters
        ↓
Component calls onFiltersChange()
        ↓
TaskPage updates URL via setSearchParams()
        ↓
URL change triggers re-render
        ↓
TanStack Query detects new queryKey
        ↓
API refetch with new parameters
        ↓
UI updates with new results
```

### 2. Dual Data Fetching (List vs Map View)

```
TaskPage renders
        ↓
Check viewMode from URL
        ↓
viewMode === 'list'?
   ├─ YES: useTasks(page, size=20, filters)
   │        ↓
   │   Fetch paginated results
   │        ↓
   │   Render TaskList + Pagination
   │
   └─ NO: useAllFilteredTasks(filters)
            ↓
       Fetch up to 1000 tasks (no pagination)
            ↓
       Render TaskMap with all results
```

### 3. Location Search Flow

```
User types city name in LocationSearchInput
        ↓
User presses Enter or clicks "Hae tehtäviä"
        ↓
useGeocoding.geocode() called
        ↓
Fetch from Nominatim OpenStreetMap API
        ↓
Parse lat/lon from response
        ↓
onFiltersChange() with coordinates + locationText
        ↓
URL updated with latitude, longitude, locationText
        ↓
Display "Sijainti asetettu: [city]"
        ↓
TaskMap centers on coordinates and sets zoom
```

### 4. Current Location Flow

```
User clicks location icon
        ↓
useGeolocation.getCurrentLocation()
        ↓
Browser geolocation permission prompt
        ↓
Get coordinates from browser
        ↓
onFiltersChange() with coordinates + "Nykyinen sijainti"
        ↓
URL updated with latitude/longitude
        ↓
Display "Sijainti asetettu: Nykyinen sijainti"
        ↓
TaskMap centers on user's location
```

### 5. Map Marker Click Flow (Stacked Markers)

```
User clicks marker on map
        ↓
handleMarkerClick(clickedTask) fires
        ↓
Filter all displayedTasks by exact lat/lng match
        ↓
Find all tasks at same coordinates (stacked)
        ↓
setSelectedTasks([task1, task2, task3])
        ↓
TaskMapInfoWindow renders with tasks array
        ↓
Show header: "3 tehtävää tässä sijainnissa"
        ↓
Scrollable list of all tasks
        ↓
User clicks "Näytä tiedot" on one task
        ↓
Navigate to TaskDetailPage
```

## Custom Hooks

### State Management Hooks

#### useFilterState

```typescript
Input:  TaskFilters (from parent)
Output: {
  state: FilterState,        // Current form values (8 fields)
  setters: Function[],       // Update individual fields (memoized)
  toggleCategory: Function,  // Toggle category selection
  buildFilters: Function,    // Transform to API format
  syncWithFilters: Function, // Handle external updates (URL changes)
  reset: Function            // Clear everything
}
```

**Responsibilities:**

- Manages 8 filter state values (searchText, categories, prices, location, radius)
- Provides memoized setters to prevent unnecessary re-renders
- Validates and clamps price values (0-500 range)
- Synchronizes internal state with external filter changes (URL updates)
- Builds TaskFilters object for API consumption

### API Integration Hooks (TanStack Query)

#### useTasks

```typescript
Input:  FetchTasksParams (page, size, filters)
Output: {
  data: PaginatedResponse<Task>,
  isLoading: boolean,
  isError: boolean,
  error: Error | null
}
```

**Features:**

- Uses TanStack Query for caching and automatic refetching
- Converts frontend sortBy to Spring Pageable sort parameter
- 5-minute stale time for cached results
- Automatic retry on failure
- Query key includes all filter parameters for precise cache invalidation

#### useAllFilteredTasks

```typescript
Input:  filters (TaskFilters), options ({ enabled?: boolean })
Output: {
  data: PaginatedResponse<Task>, // Up to 1000 tasks
  isLoading: boolean,
  isError: boolean,
  error: Error | null
}
```

**Purpose:** Fetch all filtered tasks for map view (no pagination)

**Features:**

- Fetches with page=0, size=1000
- Only enabled when viewMode === 'map'
- Shares query cache with useTasks
- Used exclusively by TaskMap component

#### useUserTasks

Same as useTasks but fetches only authenticated user's tasks

#### useTaskById

```typescript
Input:  taskId: number
Output: {
  data: Task,
  isLoading: boolean,
  isError: boolean,
  error: Error | null
}
```

#### useTaskApplications

Fetches all applications for a specific task

#### useCreateTask

```typescript
Output: {
  mutate: (taskData: CreateTaskInput) => void,
  isLoading: boolean,
  isError: boolean,
  isSuccess: boolean
}
```

**Mutations:** Automatically invalidates task lists cache on success

#### useUpdateTask

Update existing task with automatic cache invalidation

#### useDeleteTask

Delete task and clean up all related cache entries

#### useUpdateApplicationStatus

Accept or reject task applications with cache invalidation

### Browser API Integration Hooks

#### useGeocoding

```typescript
Input:  none
Output: {
  geocode: (location: string) => Promise<{ latitude: number, longitude: number }>,
  isLoading: boolean,
  error: string | null
}
```

**Integration:** Nominatim OpenStreetMap API for address → coordinates

**Features:**

- Searches for cities, addresses, postal codes
- Returns latitude/longitude for map centering
- Error handling for invalid addresses

#### useGeolocation

```typescript
Input:  none
Output: {
  getCurrentLocation: () => Promise<{ latitude: number, longitude: number }>,
  isLoading: boolean,
  error: string | null
}
```

**Integration:** Browser Geolocation API (requires user permission)

**Features:**

- Accesses device GPS/network location
- Handles permission denied gracefully
- Browser compatibility checks

## Component Props

### TaskMap

```typescript
Props: {
  tasks: Task[],             // All filtered tasks (up to 1000)
  totalElements: number,     // Total count from API
  filters: TaskFilters,      // Current active filters
  isLoading?: boolean        // Loading state
}
```

**Features:**

- Automatic clustering with MarkerClusterer (maxZoom: 14, gridSize: 40)
- Reactive map updates on filter changes
- Stacked markers handling (multiple tasks at same coordinates)
- Circle overlay showing radius filter
- Auto-centering on location filter or fitting bounds to tasks
- Task limit warning when hitting 1000 cap

### TaskMapInfoWindow

```typescript
Props: {
  tasks: Task[],             // Single task or array of stacked tasks
  onClose: () => void        // Close callback
}
```

**Features:**

- Displays single task or multiple tasks (stacked markers)
- Scrollable container (max-h-96) for many tasks
- Header showing task count: "3 tehtävää tässä sijainnissa"
- Task preview cards with borders between entries
- "Näytä tiedot" link for each task

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

### ResultsControlBar

```typescript
Props: {
  totalResults: number,
  filters: TaskFilters,
  sortBy: SortOption,
  viewMode: ViewMode,
  onSortChange: (sort: SortOption) => void,
  onViewModeChange: (mode: ViewMode) => void,
  onRemoveFilter: (filterKey: keyof TaskFilters, value?: string) => void
}
```

## State Ownership

### URL State (Single Source of Truth)

**Managed by:** TaskPage via useSearchParams()

- filters (complete TaskFilters object)
  - searchText
  - categories (array)
  - minPrice / maxPrice
  - latitude / longitude / radiusKm
  - locationText (display text for location)
  - status (default: ACTIVE)
  - sortBy (default: newest)
- page (1-indexed in URL, 0-indexed in API)
- viewMode (list/map, default: list)

**Serialization:** urlState.ts utility functions

- filtersToSearchParams() - TaskFilters → URLSearchParams
- searchParamsToFilters() - URLSearchParams → TaskFilters
- getViewMode() - Extract view mode from URL
- getPageNumber() - Extract page (converts 1-indexed → 0-indexed)

### Local State (TaskFilterPanel + useFilterState)

**Temporary form state before search:**

- searchText (text input)
- selectedCategories (checkbox states)
- minPrice / maxPrice (text inputs)
- minPriceSlider / maxPriceSlider (slider positions)
- locationSearch (location text input)
- radiusKm (radius slider)

**Synchronization:** syncWithFilters() keeps form in sync with URL

### Component-Local State

**TaskMap.tsx:**

- mapRef (google.maps.Map instance)
- selectedTasks (Task[] | null) - Currently selected markers for InfoWindow
- Clustering state managed by MarkerClusterer

**TaskFilterPanel.tsx:**

- geocoding loading/error states
- geolocation loading/error states

### TanStack Query Cache

**Query Keys (taskQueryKeys.ts):**

- lists() - All task list queries
- list(params) - Specific paginated list
- allFiltered(filters) - Map view query (1000 tasks)
- userLists() - User's task queries
- detail(taskId) - Single task detail
- applications(taskId, page, size) - Task applications

**Cache Configuration:**

- staleTime: 5 minutes
- Automatic refetch on window focus
- Automatic retry on failure
- Cache invalidation on mutations (create/update/delete)

## Performance Optimizations

### React Optimizations

1. **React.memo** on all presentational components
2. **useCallback** for all event handlers to prevent re-renders
3. **useMemo** for expensive calculations:
   - filterMappableTasks() in TaskMap
   - Mapping stats calculation (mappable vs unmappable tasks)
4. **Custom comparison** function for TaskFilterPanel memoization
5. **State batching** - single master search instead of multiple filter updates

### Google Maps Optimizations

1. **MarkerClusterer** for rendering 1000+ markers efficiently
   - maxZoom: 14 (clusters split at zoom 15+)
   - gridSize: 40 (tight clustering for better performance)
   - Custom calculator for accurate counts
2. **Conditional rendering** - only render map when viewMode === 'map'
3. **API key lazy loading** via useJsApiLoader
4. **Map instance reuse** via useRef (mapRef)

### API & Network Optimizations

1. **TanStack Query caching**:
   - 5-minute stale time reduces redundant fetches
   - Automatic background refetching
   - Query key-based cache invalidation
2. **Conditional fetching**:
   - List view: fetch only when viewMode === 'list'
   - Map view: fetch only when viewMode === 'map'
3. **Backend pagination**:
   - List view: 20 tasks per page
   - Map view: up to 1000 tasks (backend limit)
4. **URL-based state** eliminates prop drilling and enables:
   - Direct linking to filtered results
   - Browser back/forward navigation
   - Bookmark/share specific searches

### UX Optimizations

1. **Debouncing** on text inputs (implicit via master search pattern)
2. **Optimistic updates** for better perceived performance
3. **Loading states** with skeleton screens
4. **Error boundaries** for graceful failure handling
5. **Progressive disclosure** - filters collapsed by default

## File Structure

```
src/features/task/
├── components/
│   ├── TaskFilterPanel.tsx          (Filter orchestrator - 189 lines)
│   ├── CategoryFilter.tsx           (Category checkboxes - 58 lines)
│   ├── PriceRangeInput.tsx         (Price slider with validation - 131 lines)
│   ├── LocationSearchInput.tsx     (Location search - 80 lines)
│   ├── ResultsControlBar.tsx       (Active filters + controls - ~180 lines)
│   ├── SearchBar.tsx               (Quick search input - ~50 lines)
│   ├── TaskList.tsx                (Two-column card layout - 170 lines)
│   ├── TaskMap.tsx                 (Google Maps with clustering - 301 lines)
│   ├── TaskMapInfoWindow.tsx       (Marker popup for tasks - 85 lines)
│   ├── Pagination.tsx              (Page navigation - ~100 lines)
│   ├── TaskDetails.tsx             (Task detail view - ~200 lines)
│   ├── ApplicationForm.tsx         (Apply to task - ~150 lines)
│   ├── ApplicationsList.tsx        (Applications list - ~100 lines)
│   ├── ApplicationDetailsModal.tsx (Application detail modal - ~120 lines)
│   ├── CreateTask.tsx              (Task creation - ~250 lines)
│   ├── TaskWizardForm.tsx          (Multi-step task wizard - ~300 lines)
│   ├── TaskApplyButtonActions.tsx  (Application actions - ~80 lines)
│   ├── TaskerPromoCard.tsx         (Promo card - ~80 lines)
│   └── TaskFilter.tsx              (Legacy simple filter - 58 lines)
│
├── hooks/
│   ├── useFilterState.ts           (Filter state logic - 196 lines)
│   ├── useGeocoding.ts             (Nominatim API - 68 lines)
│   ├── useGeolocation.ts           (Browser geolocation - 56 lines)
│   ├── useTasks.ts                 (Fetch tasks with filters - 61 lines)
│   ├── useTask.ts                  (Task CRUD mutations - ~100 lines)
│   ├── taskQueryKeys.ts            (TanStack Query keys - ~60 lines)
│   └── index.ts                     (Hook exports)
│
├── api/
│   └── taskApi.ts                   (API integration - 356 lines)
│       ├── fetchTasks()            - GET /api/tasks with filters
│       ├── fetchUserTasks()        - GET /api/tasks/user
│       ├── fetchTaskById()         - GET /api/tasks/:id
│       ├── createTask()            - POST /api/tasks
│       ├── updateTask()            - PUT /api/tasks/:id
│       ├── deleteTask()            - DELETE /api/tasks/:id
│       ├── fetchTaskApplications() - GET /api/tasks/:id/applications
│       ├── updateApplicationStatus() - PUT /api/tasks/:id/applications/:username
│       ├── getSortParam()          - Convert sortBy to Spring format
│       └── Type definitions
│
├── utils/
│   ├── urlState.ts                  (URL state management - 155 lines)
│   │   ├── filtersToSearchParams() - Serialize filters to URL
│   │   ├── searchParamsToFilters() - Parse URL to filters
│   │   ├── getViewMode()           - Extract view mode
│   │   └── getPageNumber()         - Extract page number
│   │
│   ├── mapHelpers.ts               (Map utility functions - 58 lines)
│   │   ├── filterMappableTasks()   - Filter tasks with valid coordinates
│   │   ├── isTaskListCapped()      - Check if hit 1000 task limit
│   │   ├── getMappingStats()       - Calculate mappable stats
│   │   ├── calculateZoomFromRadius() - Convert km to zoom level
│   │   └── DEFAULT_MAP_CENTER      - Helsinki coordinates
│   │
│   ├── categoryUtils.ts            (Category utilities - ~50 lines)
│   └── applyPermissions.ts         (Application permissions - ~40 lines)
│
├── types.ts                         (TypeScript interfaces - 104 lines)
│   ├── Category type (10 categories)
│   ├── TaskStatus type (5 statuses)
│   ├── ApplicationStatus type (4 statuses)
│   ├── SortOption type (5 options)
│   ├── ViewMode type (list/map)
│   ├── TaskFilters interface
│   ├── Task interface
│   ├── TaskApplicant interface
│   ├── UserDto interface
│   ├── CategoryResponse interface
│   ├── LocationResponse interface
│   └── PaginatedResponse<T> interface
│
├── index.ts                         (Feature exports)
│
├── pages/ (in src/pages/)
│   ├── TaskPage.tsx                 (Main browsing - 185 lines)
│   ├── LandingPage.tsx              (Homepage - ~100 lines)
│   ├── TaskDetailPage.tsx           (Task detail - ~150 lines)
│   ├── OwnTaskDetailPage.tsx        (Owner view - ~200 lines)
│   └── MyTasksPage.tsx              (User tasks - ~120 lines)
│
└── ARCHITECTURE.md                  (This file)
```

**Total Lines of Code:** ~4,500+ lines across 35+ files

**Key Metrics:**

- 18 Components (6 core, 12 supporting)
- 7 Custom Hooks (1 state, 4 API, 2 browser)
- 4 Utility modules (URL state, map helpers, categories, permissions)
- 5 Page-level components
- Full TypeScript coverage
- Google Maps integration (@react-google-maps/api)
- TanStack Query for data fetching
- URL-based state management

## Integration Points

### External APIs

1. **Google Maps JavaScript API**
   - API Key: VITE_GOOGLE_MAPS_API_KEY
   - Components: GoogleMap, Marker, MarkerClusterer, Circle, InfoWindow
   - Usage: TaskMap.tsx

2. **Nominatim OpenStreetMap API**
   - Endpoint: https://nominatim.openstreetmap.org/search
   - Usage: useGeocoding.ts
   - Rate limiting: Respectful use with User-Agent

3. **Browser Geolocation API**
   - Usage: useGeolocation.ts
   - Permissions: User must grant location access

### Backend API Endpoints

```
GET /api/tasks
  Query params:
    - page (0-indexed)
    - size (default: 20, max: 1000)
    - searchText
    - categories (multiple)
    - minPrice, maxPrice
    - latitude, longitude, radiusKm
    - status (default: ACTIVE)
    - sort (e.g., "createdAt,desc", "price,asc")
  Returns: PaginatedResponse<Task>

GET /api/tasks/{id}
  Returns: Task

GET /api/tasks/user
  Requires: Authentication
  Returns: PaginatedResponse<Task> (user's tasks)

POST /api/tasks
  Requires: Authentication
  Body: CreateTaskInput
  Returns: Task

PUT /api/tasks/{id}
  Requires: Authentication
  Body: CreateTaskInput
  Returns: Task

DELETE /api/tasks/{id}
  Requires: Authentication
  Returns: void

GET /api/tasks/{id}/applications
  Requires: Authentication (task owner)
  Returns: PaginatedResponse<TaskApplicant>

PUT /api/tasks/{id}/applications/{username}
  Requires: Authentication (task owner)
  Body: { status: "ACCEPTED" | "REJECTED" }
  Returns: void
```

## Testing Strategy

### Unit Tests (Hooks)

**Recommended coverage:**

```
useFilterState
  ✓ initializes with default values
  ✓ updates individual fields
  ✓ toggles categories correctly
  ✓ builds filters object correctly
  ✓ syncs with external changes (URL updates)
  ✓ resets all values
  ✓ validates and clamps price values

useGeocoding
  ✓ fetches coordinates successfully
  ✓ handles API errors
  ✓ handles empty results
  ✓ sets loading state correctly
  ✓ returns latitude/longitude (not lat/lon)

useGeolocation
  ✓ gets current position
  ✓ handles permission denied
  ✓ handles unsupported browser
  ✓ returns latitude/longitude

useTasks
  ✓ fetches tasks with correct query key
  ✓ handles pagination parameters
  ✓ converts sortBy to Spring format
  ✓ caches results for 5 minutes

useAllFilteredTasks
  ✓ fetches max 1000 tasks
  ✓ only enabled when viewMode === 'map'
  ✓ includes all filter parameters
```

### Component Tests (Presentational)

```
CategoryFilter
  ✓ renders all 10 categories
  ✓ calls onToggle on checkbox click
  ✓ shows selected state
  ✓ displays category icons and labels

PriceRangeInput
  ✓ syncs text inputs with sliders
  ✓ prevents invalid ranges (min > max)
  ✓ shows tick marks (0-500)
  ✓ updates on slider drag
  ✓ clamps values to 0-500 range

LocationSearchInput
  ✓ calls submit on Enter key
  ✓ calls current location button
  ✓ displays error message
  ✓ shows coordinates when set
  ✓ displays radius slider
  ✓ shows "Sijainti asetettu" message

TaskMap
  ✓ renders Google Map with markers
  ✓ shows clusters for nearby markers
  ✓ displays circle overlay for radius
  ✓ centers on location filter
  ✓ fits bounds to all tasks when no filter
  ✓ shows task count warning at 1000 limit
  ✓ handles stacked markers (multiple at same coords)
  ✓ opens InfoWindow on marker click

TaskMapInfoWindow
  ✓ displays single task details
  ✓ displays multiple tasks (stacked markers)
  ✓ shows task count header when multiple
  ✓ renders scrollable list
  ✓ shows "Näytä tiedot" link for each task
```

### Integration Tests (Main Components)

```
TaskFilterPanel
  ✓ submits all filters on search
  ✓ resets all filters on reset
  ✓ geocodes location correctly
  ✓ uses current location
  ✓ prevents duplicate searches
  ✓ syncs form state with URL changes

TaskPage
  ✓ reads initial state from URL
  ✓ updates URL on filter change
  ✓ switches between list and map view
  ✓ maintains filters when switching views
  ✓ paginates correctly in list view
  ✓ fetches all tasks in map view
  ✓ handles empty results
  ✓ displays error states
```

### E2E Tests (User Flows)

```
Search Flow
  ✓ User can search by text
  ✓ User can filter by categories
  ✓ User can filter by price range
  ✓ User can search by location
  ✓ User can use current location
  ✓ User can combine multiple filters
  ✓ User can clear filters
  ✓ URL updates with filters
  ✓ Direct link with filters works

Map View Flow
  ✓ User can switch to map view
  ✓ Map shows all filtered tasks
  ✓ Clusters split when zooming in
  ✓ Click marker shows task details
  ✓ Click "Näytä tiedot" opens detail page
  ✓ Stacked markers show all tasks
  ✓ Map centers on location search
  ✓ Map respects radius filter

List View Flow
  ✓ User can switch to list view
  ✓ List shows paginated results
  ✓ User can navigate pages
  ✓ User can sort results
  ✓ Active filters display in control bar
  ✓ User can remove individual filters
  ✓ Click task card opens detail page
```
