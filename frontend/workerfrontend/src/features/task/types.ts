// Backend categories - must match backend enum values
export type Category = "CLEANING" | "GARDEN" | "MOVING" | "OTHER";

export type TaskStatus = "ACTIVE" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED" | "EXPIRED";

// Matches backend UserDto exactly
export interface UserDto {
  userName: string;
  mail: string;
  businessId: string;
  phoneNumber: string;
  address: string;
}

// Matches backend TaskDto exactly
export interface Task {
  id: number;
  user: UserDto;
  category: Category;
  title: string;
  price: number;
  startDate: string; // ISO string from LocalDateTime
  endDate: string; // ISO string from LocalDateTime
  location: string;
  status: TaskStatus;
  description: string;
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
