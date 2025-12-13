import type { TaskFilters, ViewMode } from "../types";

/**
 * Serialize filters to URL search params
 */
export function filtersToSearchParams(filters: TaskFilters, viewMode: ViewMode, page: number): URLSearchParams {
  const params = new URLSearchParams();

  // View mode (default: list)
  if (viewMode !== "list") {
    params.set("view", viewMode);
  }

  // Page (1-indexed for URL, only for list view)
  if (viewMode === "list" && page > 0) {
    params.set("page", (page + 1).toString()); // Convert 0-indexed to 1-indexed
  }

  // Text search
  if (filters.searchText?.trim()) {
    params.set("searchText", filters.searchText.trim());
  }

  // Categories (multiple values)
  if (filters.categories && filters.categories.length > 0) {
    filters.categories.forEach((cat) => params.append("categories", cat));
  }

  // Price range
  if (filters.minPrice !== undefined && filters.minPrice !== null) {
    params.set("minPrice", filters.minPrice.toString());
  }
  if (filters.maxPrice !== undefined && filters.maxPrice !== null) {
    params.set("maxPrice", filters.maxPrice.toString());
  }

  // Location
  if (filters.latitude !== undefined && filters.longitude !== undefined) {
    params.set("latitude", filters.latitude.toString());
    params.set("longitude", filters.longitude.toString());
  }
  if (filters.radiusKm !== undefined) {
    params.set("radiusKm", filters.radiusKm.toString());
  }
  if (filters.locationText?.trim()) {
    params.set("locationText", filters.locationText.trim());
  }

  // Sort
  if (filters.sortBy && filters.sortBy !== "newest") {
    params.set("sortBy", filters.sortBy);
  }

  // Status (always include if not ACTIVE)
  if (filters.status && filters.status !== "ACTIVE") {
    params.set("status", filters.status);
  }

  return params;
}

/**
 * Parse URL search params to filters
 */
export function searchParamsToFilters(searchParams: URLSearchParams): TaskFilters {
  const filters: TaskFilters = {
    status: "ACTIVE",
    sortBy: "newest",
  };

  // Text search
  const searchText = searchParams.get("searchText");
  if (searchText) {
    filters.searchText = searchText;
  }

  // Categories (can have multiple)
  const categories = searchParams.getAll("categories");
  if (categories.length > 0) {
    filters.categories = categories;
  }

  // Price range
  const minPrice = searchParams.get("minPrice");
  if (minPrice) {
    const parsed = parseInt(minPrice, 10);
    if (!isNaN(parsed)) {
      filters.minPrice = parsed;
    }
  }

  const maxPrice = searchParams.get("maxPrice");
  if (maxPrice) {
    const parsed = parseInt(maxPrice, 10);
    if (!isNaN(parsed)) {
      filters.maxPrice = parsed;
    }
  }

  // Location
  const latitude = searchParams.get("latitude");
  const longitude = searchParams.get("longitude");
  if (latitude && longitude) {
    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);
    if (!isNaN(lat) && !isNaN(lng)) {
      filters.latitude = lat;
      filters.longitude = lng;
    }
  }

  const radiusKm = searchParams.get("radiusKm");
  if (radiusKm) {
    const parsed = parseInt(radiusKm, 10);
    if (!isNaN(parsed)) {
      filters.radiusKm = parsed;
    }
  }

  const locationText = searchParams.get("locationText");
  if (locationText) {
    filters.locationText = locationText;
  }

  // Sort
  const sortBy = searchParams.get("sortBy");
  if (sortBy) {
    filters.sortBy = sortBy as TaskFilters["sortBy"];
  }

  // Status
  const status = searchParams.get("status");
  if (status) {
    filters.status = status as TaskFilters["status"];
  }

  return filters;
}

/**
 * Get view mode from URL params (default: list)
 */
export function getViewMode(searchParams: URLSearchParams): ViewMode {
  const view = searchParams.get("view");
  return view === "map" ? "map" : "list";
}

/**
 * Get page number from URL params (0-indexed for API)
 */
export function getPageNumber(searchParams: URLSearchParams): number {
  const pageParam = searchParams.get("page");
  if (!pageParam) return 0;

  const pageNumber = parseInt(pageParam, 10);
  if (isNaN(pageNumber) || pageNumber < 1) return 0;

  // Convert 1-indexed URL param to 0-indexed API param
  return pageNumber - 1;
}
