import type { UserDto } from '../Profile/types';

// Re-export for convenience
export type { UserDto };

// Backend categories 
export type Category = "Cleaning" | "Garden" | "Moving" | "Other" | "Yard" | "Forest work" | "Household" | "Repair" | "Painting" | "Snow removal";

export type TaskStatus = "ACTIVE" | "IN_PROGRESS" | "PENDING_APPROVAL" | "COMPLETED" | "CANCELLED" | "EXPIRED";

export type ApplicationStatus = "PENDING" | "ACCEPTED" | "REJECTED" | "CANCELLED";

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
  worker?: UserDto;
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

// Submission state for form handling
export type SubmissionState = "idle" | "loading" | "success" | "error";

// Form state types for task creation/editing
export type TaskFormState = {
  title: string;
  description: string;
  categoryTitle: string;
  price: string;
  startDate: string;
  endDate: string;
  streetAddress: string;
  postalCode: string;
  city: string;
  country: string;
};

// Form state types for contact information
export type ContactFormState = {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
};

// Input types for task creation/editing
export interface TaskCategoryInput {
  title: Category | string;
  categoryId?: number;
}

// Location input for task creation/editing
export interface TaskLocationInput {
  streetAddress: string;
  postalCode: string;
  city: string;
  country: string;
  latitude?: number;
  longitude?: number;
}

// Task wizard payload combining task, contact, categories, and location inputs
export type TaskWizardPayload = {
  task: TaskFormState;
  contact: ContactFormState;
  categories: TaskCategoryInput[];
  location: TaskLocationInput;
};

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
