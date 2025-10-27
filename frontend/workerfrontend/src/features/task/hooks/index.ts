/**
 * Custom hooks for task feature
 */

// Pagination
export { usePagination } from "./usePagination";

// Filter management
export { useFilterState } from './useFilterState';
export type { FilterState, UseFilterStateReturn } from './useFilterState';

// Location services
export { useGeocoding } from './useGeocoding';
export type { GeocodingResult, UseGeocodingReturn } from './useGeocoding';

export { useGeolocation } from './useGeolocation';
export type { GeolocationResult, UseGeolocationReturn } from './useGeolocation';

// Task queries
export { useTasks } from './useTasks';
export { useTaskById } from './useTaskById';
export { useCreateTask } from './useCreateTask';
export { useUserTasks } from './useUserTasks';
export { useTaskApplications } from './useTaskApplications';
export { useUserApplication } from './useUserApplication';
