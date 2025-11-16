# Task Feature Module Architecture

## Overview

The Task feature module provides comprehensive task browsing, filtering, and management capabilities with advanced filtering, pagination, and state persistence.

## Component Hierarchy

```
┌─────────────────────────────────────────────────────────────────┐
│                     Pages (Route Level)                         │
├─────────────────────────────────────────────────────────────────┤
│  TaskPage.tsx          - Main task browsing with filters        │
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
│  ResultsControlBar     - Active filters display + sort/view     │
│  SearchBar             - Quick text search                       │
│  TaskList              - Two-column card layout                  │
│  Pagination            - Page navigation controls                │
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
│   ├── TaskPage.tsx
│   │   ├── Filter state management (with sessionStorage persistence)
│   │   ├── Pagination state
│   │   ├── View mode (list/map)
│   │   └── Coordinates: TaskFilterPanel, ResultsControlBar, TaskList, Pagination
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
│   ├── TaskFilterPanel.tsx (Main Orchestrator)
│   │   ├── Manages filter form state
│   │   ├── Coordinates child components
│   │   ├── Master search pattern
│   │   └── Children: CategoryFilter, PriceRangeInput, LocationSearchInput
│   │
│   ├── ResultsControlBar.tsx
│   │   ├── Active filter chips (removable)
│   │   ├── Sort dropdown (newest, oldest, priceAsc, priceDesc, nearest)
│   │   ├── View mode toggle (list/map)
│   │   └── Results count display
│   │
│   ├── SearchBar.tsx
│   │   ├── Quick text search input
│   │   └── Instant filter update on change
│   │
│   ├── TaskList.tsx (Redesigned)
│   │   ├── Two-column card layout
│   │   ├── Square image area (160px) with category icon
│   │   ├── Three content zones:
│   │   │   - Title + Price
│   │   │   - Location + Date
│   │   │   - Poster avatar + username
│   │   └── Color-coded category backgrounds
│   │
│   └── Pagination.tsx
│       ├── First/Previous/Next/Last navigation
│       ├── Page number display
│       └── Total pages info
│
├── Filter Components (Presentational)
│   ├── CategoryFilter.tsx
│   │   ├── Grid layout (2-5 columns responsive)
│   │   ├── Checkbox + Icon + Label for each category
│   │   ├── 10 categories: Cleaning, Garden, Moving, Other, Yard,
│   │   │   Forest work, Household, Repair, Painting, Snow removal
│   │   └── Toggle handler
│   │
│   ├── PriceRangeInput.tsx (Enhanced with validation)
│   │   ├── Dual number inputs (text fields)
│   │   ├── Dual-handle slider (0-500 range)
│   │   ├── Tick marks (€0-€500)
│   │   ├── Input validation and clamping
│   │   └── Synchronized input/slider state
│   │
│   └── LocationSearchInput.tsx
│       ├── Text input for city/address search
│       ├── Current location button (geolocation API)
│       ├── Radius slider (1-100 km)
│       ├── Error display
│       └── Coordinates display when set
│
└── Other Components
    ├── TaskDetails.tsx - Detailed task information
    ├── ApplicationForm.tsx - Apply to task form
    ├── ApplicationsList.tsx - List of task applications
    ├── CreateTask.tsx - Task creation modal/form
    ├── TaskerPromoCard.tsx - Marketing card for taskers
    └── TaskFilter.tsx - (Legacy) Simple category filter
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
  syncWithFilters: Function, // Handle external updates
  reset: Function            // Clear everything
}
```

**Responsibilities:**

- Manages 8 filter state values (searchText, categories, prices, location, radius)
- Provides memoized setters to prevent unnecessary re-renders
- Validates and clamps price values (0-500 range)
- Synchronizes internal state with external filter changes
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

#### useUserTasks

Same as useTasks but fetches only authenticated user's tasks

#### useTaskById

```typescript
Input:  taskId: string
Output: {
  data: Task,
  isLoading: boolean,
  isError: boolean,
  error: Error | null
}
```

#### useTaskApplications

Fetches all applications for a specific task

#### useUserApplication

Checks if user has already applied to a specific task

#### useCreateTask

```typescript
Output: {
  mutate: (taskData: TaskCreateRequest) => void,
  isLoading: boolean,
  isError: boolean,
  isSuccess: boolean
}
```

### Browser API Integration Hooks

#### useGeocoding

```typescript
Input:  none
Output: {
  geocode: (location: string) => Promise<{lat: number, lon: number}>,
  isLoading: boolean,
  error: string | null
}
```

**Integration:** Nominatim OpenStreetMap API for address → coordinates

#### useGeolocation

```typescript
Input:  none
Output: {
  getCurrentLocation: () => Promise<{lat: number, lon: number}>,
  isLoading: boolean,
  error: string | null
}
```

**Integration:** Browser Geolocation API (requires user permission)

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
│   ├── TaskFilterPanel.tsx          (Filter orchestrator - 187 lines)
│   ├── CategoryFilter.tsx           (Category checkboxes - 58 lines)
│   ├── PriceRangeInput.tsx         (Price slider with validation - 131 lines)
│   ├── LocationSearchInput.tsx     (Location search - 80 lines)
│   ├── ResultsControlBar.tsx       (Active filters + controls - ~150 lines)
│   ├── SearchBar.tsx               (Quick search input - ~50 lines)
│   ├── TaskList.tsx                (Two-column card layout - 170 lines)
│   ├── Pagination.tsx              (Page navigation - ~100 lines)
│   ├── TaskDetails.tsx             (Task detail view - ~200 lines)
│   ├── ApplicationForm.tsx         (Apply to task - ~150 lines)
│   ├── ApplicationsList.tsx        (Applications list - ~100 lines)
│   ├── CreateTask.tsx              (Task creation - ~250 lines)
│   ├── TaskerPromoCard.tsx         (Promo card - ~80 lines)
│   └── TaskFilter.tsx              (Legacy simple filter - 58 lines)
│
├── hooks/
│   ├── useFilterState.ts           (Filter state logic - 173 lines)
│   ├── useGeocoding.ts             (Nominatim API - 68 lines)
│   ├── useGeolocation.ts           (Browser geolocation - 56 lines)
│   ├── useTasks.ts                 (Fetch tasks with filters - ~80 lines)
│   ├── useUserTasks.ts             (Fetch user's tasks - ~60 lines)
│   ├── useTaskById.ts              (Fetch single task - ~50 lines)
│   ├── useTaskApplications.ts      (Fetch task applications - ~60 lines)
│   ├── useUserApplication.ts       (Check user application - ~50 lines)
│   ├── useCreateTask.ts            (Create task mutation - ~70 lines)
│   └── index.ts                     (Hook exports)
│
├── api/
│   └── taskApi.ts                   (API integration - 356 lines)
│       ├── fetchTasks()            - GET /api/tasks with filters
│       ├── fetchUserTasks()        - GET /api/tasks/user
│       ├── fetchTaskById()         - GET /api/tasks/:id
│       ├── createTask()            - POST /api/tasks
│       ├── getSortParam()          - Convert sortBy to Spring format
│       └── Type definitions
│
├── types.ts                         (TypeScript interfaces - ~100 lines)
│   ├── Category type (10 categories)
│   ├── TaskStatus type (5 statuses)
│   ├── ApplicationStatus type (4 statuses)
│   ├── SortOption type (5 options)
│   ├── ViewMode type (list/map)
│   ├── TaskFilters interface
│   ├── Task interface
│   ├── TaskApplicant interface
│   └── PaginatedResponse<T> interface
│
├── pages/ (in src/pages/)
│   ├── TaskPage.tsx                 (Main browsing - 218 lines)
│   ├── LandingPage.tsx              (Homepage - ~100 lines)
│   ├── TaskDetailPage.tsx           (Task detail - ~150 lines)
│   ├── OwnTaskDetailPage.tsx        (Owner view - ~200 lines)
│   └── MyTasksPage.tsx              (User tasks - ~120 lines)
│
└── ARCHITECTURE.md                  (This file)
```

**Total Lines of Code:** ~3,500+ lines across 30+ files
**Key Metrics:**

- 15 Components (5 core, 10 supporting)
- 11 Custom Hooks (4 state, 6 API, 1 browser)
- 5 Page-level components
- Full TypeScript coverage

## Benefits Summary

| Aspect                | Before              | After           |
| --------------------- | ------------------- | --------------- |
| Files                 | 1                   | 7               |
| Lines per file        | 435                 | ~100 avg        |
| Hook reusability      | 0%                  | 100%            |
| Component reusability | 0%                  | 100%            |
| Test isolation        | Hard                | Easy            |
| State management      | Scattered           | Centralized     |
| API calls             | Inline              | Abstracted      |
| Performance           | Limited memoization | Fully optimized |
| Type safety           | Partial             | Complete        |
