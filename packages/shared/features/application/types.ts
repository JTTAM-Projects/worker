import type { UserDto, Category, Task } from '../task/types';

export type ApplicationStatus = 
  | 'PENDING' 
  | 'ACCEPTED' 
  | 'REJECTED' 
  | 'WITHDRAWN';

export interface ApplicationFilters {
  searchText?: string;
  categories?: string[];
  minPrice?: number;
  maxPrice?: number;
  applicationStatus?:  ApplicationStatus
}

export interface Application {
  priceSuggestion: number,
  timeSuggestion: string,
  description: string,
  applicationStatus: ApplicationStatus
}

export interface ApplicationWithDetails {
  user: UserDto;
  categories: Category[];
  priceSuggestion: number;
  timeSuggestion: string;
  description?: string;
  applicationStatus: ApplicationStatus;
  task: Task
}

export interface PaginatedApplications {
  content: ApplicationWithDetails[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

export interface PaginatedResponse<T> {
  totalPages: number;
  totalElements: number;
  pageable: {
    pageNumber: number;
    pageSize: number;
    paged: boolean;
    unpaged: boolean;
    offset: number;
    sort: {
      sorted: boolean;
      unsorted: boolean;
      empty: boolean;
    };
  };
  first: boolean;
  last: boolean;
  size: number;
  content: T[];
  number: number;
  sort: {
    sorted: boolean;
    unsorted: boolean;
    empty: boolean;
  };
  numberOfElements: number;
  empty: boolean;
}

export type UpdateApplicationPayload = {
  priceSuggestion?: number;
  timeSuggestion?: string;
  description?: string;
  allowCounterOffers?: boolean;
  allowCalls?: boolean;
};

