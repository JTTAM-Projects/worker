import type { Task, PaginatedResponse, Category, TaskStatus } from '../types';

// This is a file for interacting with the backend task API.
// It uses the Fetch API to make HTTP requests.
// GET requests are public and don't require authentication.

const API_BASE_URL = 'http://localhost:8080/api';

export interface FetchTasksParams {
  page?: number;
  size?: number;
  category?: Category;
  status?: TaskStatus;
}

export async function fetchTasks(params: FetchTasksParams = {}): Promise<PaginatedResponse<Task>> {
  const { page = 0, size = 10, category, status } = params;

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

  const response = await fetch(`${API_BASE_URL}/task/all-tasks?${queryParams.toString()}`, {
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch tasks: ${response.statusText}`);
  }

  return response.json();
}
