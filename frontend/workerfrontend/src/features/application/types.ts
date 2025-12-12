import type { UserDto } from '../Profile/types';
import type { Category, PaginatedResponse } from '../task/types';

// Re-export for convenience
export type { PaginatedResponse };

/** Status of a job application (matches backend enum) */
export type ApplicationStatus = 
  | 'PENDING' 
  | 'ACCEPTED' 
  | 'REJECTED' 
  | 'WITHDRAWN';

/** Mode for application form - determines if creating new or editing existing */
export type ApplicationFormMode = "create" | "edit";

/** Form values for creating/editing an application */
export interface ApplicationFormValues {
  priceSuggestion: number;
  timeSuggestion: string;
  description?: string;
}

/** Filter parameters for searching applications */
export interface ApplicationFilters {
  searchText?: string;
  categories?: string[];
  minPrice?: number;
  maxPrice?: number;
  applicationStatus?:  ApplicationStatus
}

/** Basic application data without user details */
export interface Application {
  priceSuggestion: number,
  timeSuggestion: string,
  description: string,
  applicationStatus: ApplicationStatus
}

/** Application with full user details and task information (from backend) */
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

/** Payload for updating an existing application */
export type UpdateApplicationPayload = {
  priceSuggestion?: number;
  timeSuggestion?: string;
  description?: string;
  allowCounterOffers?: boolean;
  allowCalls?: boolean;
};

// Mutation input types

/** Input for creating a new application (used by useCreateApplication hook) */
export interface CreateApplicationInput {
  taskId: number;
  payload: ApplicationPayload;
}

/** Input for updating an existing application (used by useUpdateApplication hook) */
export interface UpdateApplicationInput {
  taskId: number;
  payload: ApplicationPayload;
}

/** Input for deleting an application (used by useDeleteApplication hook) */
export interface DeleteApplicationInput {
  taskId: number;
}

// Re-import ApplicationPayload from api for the input types
import type { ApplicationPayload } from './api/applicationApi';
