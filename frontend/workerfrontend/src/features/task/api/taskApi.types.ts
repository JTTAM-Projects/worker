import type { TaskFilters, TaskStatus } from "../types";

export interface TaskCategoryInput {
  title: string;
  categoryId?: number;
}

export interface TaskLocationInput {
  streetAddress: string;
  postalCode: string;
  city: string;
  country: string;
  latitude?: number;
  longitude?: number;
}

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

export interface FetchTasksParams extends TaskFilters {
  page?: number;
  size?: number;
}
