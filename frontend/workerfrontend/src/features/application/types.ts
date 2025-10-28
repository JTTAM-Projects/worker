import type { UserDto, Category } from '../task/types';

export type ApplicationStatus = 
  | 'PENDING' 
  | 'ACCEPTED' 
  | 'REJECTED' 
  | 'WITHDRAWN';

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
/* export interface UserApplications {
  application: Application,
  user: UserDto,
  
} 
  export type ApplicationList = ApplicationWithDetails[];  
*/

