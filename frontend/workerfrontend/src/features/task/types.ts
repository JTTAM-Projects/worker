import type { UserDto } from "../Profile/types";

// Re-export for convenience
export type { UserDto };

/** Available task categories (matches backend enum) */
export type Category =
  | "Cleaning"
  | "Garden"
  | "Moving"
  | "Other"
  | "Yard"
  | "Forest work"
  | "Household"
  | "Repair"
  | "Painting"
  | "Snow removal";

/** Task lifecycle status (matches backend enum) */
export type TaskStatus = "ACTIVE" | "IN_PROGRESS" | "PENDING_APPROVAL" | "COMPLETED" | "CANCELLED" | "EXPIRED";

/** Application status for task applicants (matches backend enum) */
export type ApplicationStatus = "PENDING" | "ACCEPTED" | "REJECTED" | "CANCELLED";

/** Available sort options for task lists */
export type SortOption = "newest" | "oldest" | "priceAsc" | "priceDesc" | "nearest";

/** Display mode for task browsing (list or map view) */
export type ViewMode = "list" | "map";

/** Filter parameters for searching tasks (matches backend TaskDataGridFilters) */
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

/** Category response from backend API */
export interface CategoryResponse {
  title: string;
}

/** Location response from backend API */
export interface LocationResponse {
  locationId?: number;
  streetAddress?: string;
  postalCode?: string;
  city?: string;
  country?: string;
  latitude?: number;
  longitude?: number;
}

/** Complete task data (matches backend TaskListDTO) */
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

/** Task applicant details (matches backend TaskApplicantDto) */
export interface TaskApplicant {
  appliedUser: UserDto;
  priceSuggestion: number;
  createdAt: string; // ISO string from Instant
  applicationStatus: ApplicationStatus;
  // Optional fields - backend may or may not provide these depending on implementation
  timeSuggestion: string; // ISO 8601 datetime string suggested by applicant
  description?: string; // free text message from applicant
}

/** UI state for form submission tracking */
export type SubmissionState = "idle" | "loading" | "success" | "error";

/** Form state for task creation/editing wizard */
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

/** Form state for contact information in task wizard */
export type ContactFormState = {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
};

/** Category input for creating/editing tasks */
export interface TaskCategoryInput {
  title: Category | string;
  categoryId?: number;
}

/** Location input for creating/editing tasks */
export interface TaskLocationInput {
  streetAddress: string;
  postalCode: string;
  city: string;
  country: string;
  latitude?: number;
  longitude?: number;
}

/** Complete payload from task creation wizard */
export type TaskWizardPayload = {
  task: TaskFormState;
  contact: ContactFormState;
  categories: TaskCategoryInput[];
  location: TaskLocationInput;
};

// Mutation input types

/** Input for creating a new task (used by useCreateTask hook) */
export interface CreateTaskInput {
  categories: TaskCategoryInput[];
  title: string;
  price: number;
  startDate: string;
  endDate: string;
  location: TaskLocationInput;
  description?: string;
  status?: TaskStatus;
}

/** Input for deleting a task (used by useDeleteTask hook) */
export interface DeleteTaskInput {
  taskId: number;
}

/** Input for updating task status (used by useUpdateTaskStatus hook) */
export interface UpdateTaskStatusInput {
  taskId: number;
  status: TaskStatus;
}

/** Generic paginated response from backend API */
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
