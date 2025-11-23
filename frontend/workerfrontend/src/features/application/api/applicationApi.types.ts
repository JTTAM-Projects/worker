import type { ApplicationFilters, ApplicationStatus } from "../../application/types";

export interface ApplicationPayload {
  priceSuggestion: number;
  timeSuggestion: string;
  description?: string;
}

export interface FetchApplicationParams extends ApplicationFilters {
  page: number;
  size: number;
  applicationStatus: ApplicationStatus;
}
