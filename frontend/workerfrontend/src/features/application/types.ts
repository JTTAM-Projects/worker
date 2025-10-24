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

/* export interface UserApplications {
  application: Application,
  user: UserDto,
  
} 
  export type ApplicationList = ApplicationWithDetails[];  
*/

