// Backend categories 
export type Category = "Cleaning" | "Garden" | "Moving" | "Other" | "Yard" | "Forest work" | "Household" | "Repair" | "Painting" | "Snow removal";

export type TaskStatus = "ACTIVE" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED" | "EXPIRED";

export type ApplicationStatus = "PENDING" | "ACCEPTED" | "REJECTED" | "CANCELLED" | "WITHDRAWN";

export type SortOption = "newest" | "oldest" | "priceAsc" | "priceDesc" | "nearest";

export type ViewMode = "list" | "map";

// Task filter parameters matching backend TaskDataGridFilters
export interface TaskFilters {
  searchText?: string;
  categories?: string[];
  minPrice?: number;
  maxPrice?: number;
  latitude?: number;
  longitude?: number;
  radiusKm?: number;
  locationText?: string; // User-entered location text for display
  status?: TaskStatus;
  sortBy?: SortOption;
}

// Matches backend CategoryResponse
export interface CategoryResponse {
  title: string;
}

// Matches backend LocationResponse
export interface LocationResponse {
  locationId?: number;
  streetAddress?: string;
  postalCode?: string;
  city?: string;
  country?: string;
  latitude?: number;
  longitude?: number;
}

// Matches backend UserResponse/UserDto
export interface UserDto {
  userName: string;
  mail: string;
  businessId: string;
  phoneNumber: string;
  address: string;
}

// Matches backend TaskListDTO exactly
export interface Task {
  id: number;
  user: UserDto;
  categories: CategoryResponse[]; // Changed from single category to array of CategoryResponse
  title: string;
  price: number;
  startDate: string; // ISO string from LocalDateTime
  endDate: string; // ISO string from LocalDateTime
  locations: LocationResponse[]; // Changed from singular to array to match backend Set<LocationResponse>
  status: TaskStatus;
  description: string;
}

// Matches backend TaskApplicantDto
export interface TaskApplicant {
  appliedUser: UserDto;
  priceSuggestion: number;
  createdAt: string; // ISO string from Instant
  applicationStatus: ApplicationStatus;
  // Optional fields - backend may or may not provide these depending on implementation
  timeSuggestion: string; // ISO 8601 datetime string suggested by applicant
  description?: string; // free text message from applicant
}

// Paginated response from backend
export interface PaginatedResponse<T> {
  content: T[];
  pageable: {
    pageNumber: number;
    pageSize: number;
    sort: {
      empty: boolean;
      sorted: boolean;
      unsorted: boolean;
    };
    offset: number;
    paged: boolean;
    unpaged: boolean;
  };
  totalPages: number;
  totalElements: number;
  last: boolean;
  size: number;
  number: number;
  sort: {
    empty: boolean;
    sorted: boolean;
    unsorted: boolean;
  };
  numberOfElements: number;
  first: boolean;
  empty: boolean;
}
