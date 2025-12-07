import type { UserDto } from '../Profile/types';
import type { Category } from '../task/types';

export type ApplicationStatus = 
  | 'PENDING' 
  | 'ACCEPTED' 
  | 'REJECTED' 
  | 'WITHDRAWN';

export type ApplicationFormMode = "create" | "edit";

export interface ApplicationFormValues {
  priceSuggestion: number;
  timeSuggestion: string;
  description?: string;
}

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
  taskTitle: string;
  priceSuggestion: number;
  timeSuggestion: string;
  description?: string;
  applicationStatus: ApplicationStatus;
  task?: {
    id: number;
    title?: string;
    description?: string;
    startDate?: string;
    endDate?: string;
  };
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
