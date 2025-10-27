// Backend categories 
export type Category = "Cleaning" | "Garden" | "Moving" | "Other" | "Yard" | "Forest work" | "Household" | "Repair" | "Painting" | "Snow removal";

export type TaskStatus = "ACTIVE" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED" | "EXPIRED";

export type ApplicationStatus = "PENDING" | "ACCEPTED" | "REJECTED" | "CANCELLED";

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
  location: LocationResponse; // Changed from string to LocationResponse
  status: TaskStatus;
  description: string;
}

// Matches backend TaskApplicantDto
export interface TaskApplicant {
  appliedUser: UserDto;
  priceSuggestion: number;
  createdAt: string; // ISO string from Instant
  applicationStatus: ApplicationStatus;
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
