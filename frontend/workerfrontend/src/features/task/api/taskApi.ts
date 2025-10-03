import type { Task, PaginatedResponse, Category, TaskStatus } from '../types';
import { createMockPaginatedResponse } from './mockData';

const API_BASE_URL = 'http://localhost:8080/api';
const USE_MOCK_DATA = true; // Vaihda false kun backend on käytössä

export interface FetchTasksParams {
  page?: number;
  size?: number;
  category?: Category;
  status?: TaskStatus;
}

export async function fetchTasks(params: FetchTasksParams = {}): Promise<PaginatedResponse<Task>> {
  const { page = 0, size = 10, category, status } = params;
  
  // Use mock data if enabled
  if (USE_MOCK_DATA) {
    return createMockPaginatedResponse(page, size, category);
  }

  const queryParams = new URLSearchParams({
    page: page.toString(),
    size: size.toString(),
  });

  if (category) {
    queryParams.append('category', category);
  }

  if (status) {
    queryParams.append('status', status);
  }

  const response = await fetch(`${API_BASE_URL}/task/all-tasks?${queryParams.toString()}`);

  if (!response.ok) {
    throw new Error(`Failed to fetch tasks: ${response.statusText}`);
  }

  return response.json();
}

export async function resetTestData(): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/test-database/reset`, {
    method: 'POST',
  });

  if (!response.ok) {
    throw new Error(`Failed to reset test data: ${response.statusText}`);
  }
}
