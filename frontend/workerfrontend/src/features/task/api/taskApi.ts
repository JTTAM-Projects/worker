import type { Task, PaginatedResponse, Category, TaskStatus } from "../types";

// This is a file for interacting with the backend task API.
// It uses the Fetch API to make HTTP requests.
// GET requests are public and don't require authentication.

const API_BASE_URL = "http://localhost:8080/api";

export interface FetchTasksParams {
  page?: number;
  size?: number;
  category?: Category;
  status?: TaskStatus;
}

// Fetch tasks with optional pagination and filtering
export async function fetchTasks(
  params: FetchTasksParams = {}
): Promise<PaginatedResponse<Task>> {
  const { page = 0, size = 10, category, status } = params;

  const queryParams = new URLSearchParams({
    page: page.toString(),
    size: size.toString(),
  });

  if (category) {
    queryParams.append("categoryTitle", category); // Backend uses categoryTitle, not category
  }

  if (status) {
    queryParams.append("status", status);
  }

  const response = await fetch(
    `${API_BASE_URL}/task/all-tasks?${queryParams.toString()}`,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch tasks: ${response.statusText}`);
  }
  return response.json();
}

// Fetch user's own tasks (requires authentication)
export async function fetchUserTasks(
  getAccessToken: () => Promise<string>, params: FetchTasksParams = {}
): Promise<PaginatedResponse<Task>> {
  const token = await getAccessToken();
  const { page = 0, size = 10, category, status } = params;

  const queryParams = new URLSearchParams({
    page: page.toString(),
    size: size.toString(),
  });

  if (category) {
    queryParams.append("categoryTitle", category); // Backend uses categoryTitle, not category
  }

  if (status) {
    queryParams.append("status", status);
  }

  const response = await fetch(`${API_BASE_URL}/task/user-tasks`, {
    headers: {
      "Content-Type": "application/json",
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch user tasks: ${response.statusText}`);
  }

  return response.json();
}

export interface TaskCategoryInput {
  title: Category | string;
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

// Create a new task (requires authentication)
export async function createTask(
  getAccessTokenSilently: () => Promise<string>,
  payload: CreateTaskInput
): Promise<Task> {
  const token = await getAccessTokenSilently();

  const response = await fetch(`${API_BASE_URL}/task`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(`Failed to create task: ${response.status} ${text}`);
  }

  return response.json();
}
