import type { Task } from '../types';

/**
 * Filter tasks that have valid location coordinates for mapping
 */
export function filterMappableTasks(tasks: Task[]): Task[] {
  return tasks.filter(
    (task) =>
      task.location &&
      typeof task.location.latitude === 'number' &&
      typeof task.location.longitude === 'number' &&
      !isNaN(task.location.latitude) &&
      !isNaN(task.location.longitude)
  );
}

/**
 * Check if the task list has been capped at the maximum (1000 tasks)
 * Returns true if we likely hit the limit and there may be more tasks
 */
export function isTaskListCapped(totalElements: number, returnedCount: number): boolean {
  // If we got exactly 1000 tasks and total is >= 1000, we likely hit the cap
  return returnedCount === 1000 && totalElements >= 1000;
}

/**
 * Get stats about mappable vs non-mappable tasks
 */
export function getMappingStats(tasks: Task[]) {
  const mappableTasks = filterMappableTasks(tasks);
  return {
    totalTasks: tasks.length,
    mappableTasks: mappableTasks.length,
    unmappableTasks: tasks.length - mappableTasks.length,
    hasUnmappableTasks: mappableTasks.length < tasks.length,
  };
}

/**
 * Default map center (Helsinki, Finland)
 */
export const DEFAULT_MAP_CENTER = {
  lat: 60.1699,
  lng: 24.9384,
};

/**
 * Calculate appropriate zoom level based on radius in kilometers
 */
export function calculateZoomFromRadius(radiusKm: number): number {
  // Approximate zoom levels for different radius values
  if (radiusKm <= 1) return 14;
  if (radiusKm <= 5) return 12;
  if (radiusKm <= 10) return 11;
  if (radiusKm <= 25) return 10;
  if (radiusKm <= 50) return 9;
  if (radiusKm <= 100) return 8;
  return 7;
}
