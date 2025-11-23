// In-memory mock-backend: simuloi REST-API:a ilman verkkoa testejä varten
import type {
  PaginatedResponse,
  Task,
  TaskApplicant,
  TaskStatus,
  CategoryResponse,
  Category,
  ApplicationStatus as TaskApplicationStatus,
} from "../features/task/types";
import type { TaskApplicationDetails } from "../features/task/api/taskApi";
import type { CreateTaskInput, FetchTasksParams } from "../features/task/api/taskApi.types";
import type { ApplicationPayload, FetchApplicationParams } from "../features/application/api/applicationApi.types";
import type { ApplicationWithDetails } from "../features/application/types";
import {
  buildPaginatedResponse,
  initialApplications,
  initialTaskApplicants,
  initialTasks,
  mockUser,
  mockCategories,
  type StoredApplication,
  type StoredTaskApplicant,
} from "./mockData";

const isMockMode = import.meta.env.VITE_AUTH_MODE === "mock"; // ohjaa kaikki kutsut in-memory backendille testissä

// In-memory backend: simuloi REST-API:a ja pitää datan muistissa testisession ajan
class MockApi {
  private tasks: Task[] = structuredClone(initialTasks);
  private applications: StoredApplication[] = structuredClone(initialApplications);
  private taskApplicants: StoredTaskApplicant[] = structuredClone(initialTaskApplicants);
  private nextTaskId = this.tasks.length + 1;

  reset() {
    // Palauttaa kaikki listat alkuperäiseen siemendataan
    this.tasks = structuredClone(initialTasks);
    this.applications = structuredClone(initialApplications);
    this.taskApplicants = structuredClone(initialTaskApplicants);
    this.nextTaskId = this.tasks.length + 1;
  }

  fetchTasks(params: FetchTasksParams = {}): PaginatedResponse<Task> {
    // Julkinen tehtävälista mockattuna
    return this.filterTasks(params);
  }

  fetchUserTasks(params: FetchTasksParams = {}): PaginatedResponse<Task> {
    // Omien tehtävien lista mockattuna
    return this.filterTasks(params);
  }

  fetchTaskById(taskId: number): Task {
    // Yksittäisen tehtävän haku mock-datasta
    const task = this.tasks.find((t) => t.id === taskId);
    if (!task) {
      throw new Error(`Task ${taskId} not found`);
    }
    return structuredClone(task);
  }

  fetchTaskApplications(taskId: number, params: { page?: number; size?: number } = {}): PaginatedResponse<TaskApplicant> {
    // Tehtävän hakijoiden listaus
    const applicants = this.taskApplicants
      .filter((app) => app.taskId === taskId)
      .map((app) => ({ ...app, appliedUser: { ...app.appliedUser } }));
    return buildPaginatedResponse(applicants, params.page ?? 0, params.size ?? 10);
  }

  createTask(payload: CreateTaskInput): Task {
    // Lisää uusi tehtävä mock-listaan
    const newTask: Task = {
      id: this.nextTaskId++,
      user: mockUser,
      categories: payload.categories ?? [{ title: "Other" }],
      title: payload.title ?? "Uusi tehtävä",
      price: payload.price ?? 0,
      startDate: payload.startDate ?? new Date().toISOString(),
      endDate: payload.endDate ?? new Date().toISOString(),
      locations: payload.location ? [payload.location] : [],
      status: payload.status ?? "ACTIVE",
      description: payload.description ?? "",
    };
    this.tasks.unshift(newTask);
    return structuredClone(newTask);
  }

  updateTask(taskId: number, payload: CreateTaskInput): Task {
    // Päivitä olemassa oleva tehtävä
    const index = this.tasks.findIndex((task) => task.id === taskId);
    if (index === -1) {
      throw new Error("Task not found");
    }
    this.tasks[index] = {
      ...this.tasks[index],
      ...payload,
      locations: payload.location ? [payload.location] : [],
    };
    return structuredClone(this.tasks[index]);
  }

  deleteTask(taskId: number): void {
    // Poista tehtävä ja siihen liittyvät hakemukset
    this.tasks = this.tasks.filter((task) => task.id !== taskId);
    this.applications = this.applications.filter((app) => app.taskId !== taskId);
    this.taskApplicants = this.taskApplicants.filter((app) => app.taskId !== taskId);
  }

  fetchApplication(taskId: number): ApplicationWithDetails | null {
    // Palauta yhden käyttäjän hakemus tehtävään
    const application = this.applications.find((app) => app.taskId === taskId);
    return application ? structuredClone(application) : null;
  }

  createApplication(taskId: number, payload: ApplicationPayload): ApplicationWithDetails {
    // Luo uusi hakemus ja liitä tehtävän tietoihin
    const existing = this.applications.find((app) => app.taskId === taskId);
    if (existing) {
      throw new Error("Olet jo hakenut tähän tehtävään");
    }
    const task = this.fetchTaskById(taskId);
    const newApplication: StoredApplication = {
      id: `app-${Date.now()}`,
      taskId,
      applicantUsername: mockUser.userName,
      user: mockUser,
      categories: task.categories.map((cat) => cat.title as Category),
      taskTitle: task.title,
      priceSuggestion: payload.priceSuggestion ?? 0,
      timeSuggestion: payload.timeSuggestion ?? new Date().toISOString(),
      description: payload.description ?? "",
      applicationStatus: "PENDING",
      task: {
        id: task.id,
        title: task.title,
        description: task.description,
        startDate: task.startDate,
        endDate: task.endDate,
      },
    };
    this.applications.push(newApplication);
    return structuredClone(newApplication);
  }

  updateApplication(taskId: number, payload: ApplicationPayload): ApplicationWithDetails {
    // Päivitä olemassa oleva hakemus
    const index = this.applications.findIndex((app) => app.taskId === taskId);
    if (index === -1) {
      throw new Error("Hakemusta ei löytynyt");
    }
    this.applications[index] = {
      ...this.applications[index],
      ...payload,
    };
    return structuredClone(this.applications[index]);
  }

  deleteApplication(taskId: number): void {
    // Poista hakemus
    this.applications = this.applications.filter((app) => app.taskId !== taskId);
  }

  fetchAllApplications(params: Partial<FetchApplicationParams> = {}): PaginatedResponse<ApplicationWithDetails> {
    // Lista kaikkia hakemuksia suodattimilla
    const { applicationStatus, searchText, categories, minPrice, maxPrice, page = 0, size = 10 } = params;

    let list = [...this.applications];

    if (applicationStatus) {
      list = list.filter((app) => app.applicationStatus === applicationStatus);
    }

    if (searchText && searchText.trim()) {
      const normalized = searchText.toLowerCase();
      list = list.filter(
        (app) =>
          app.taskTitle.toLowerCase().includes(normalized) || app.description?.toLowerCase().includes(normalized)
      );
    }

    if (categories && categories.length > 0) {
      list = list.filter((app) => app.categories?.some((cat) => categories.includes(cat)));
    }

    if (minPrice !== undefined) {
      list = list.filter((app) => app.priceSuggestion >= minPrice);
    }

    if (maxPrice !== undefined) {
      list = list.filter((app) => app.priceSuggestion <= maxPrice);
    }

    return buildPaginatedResponse(list, page, size);
  }

  fetchApplicationDetails(taskId: number, username: string): TaskApplicationDetails {
    // Yksittäisen hakijan hakemuksen yksityiskohdat
    const applicant = this.taskApplicants.find(
      (app) => app.taskId === taskId && app.appliedUser.userName === username
    );
    if (!applicant) {
      throw new Error("Hakemusta ei löytynyt");
    }
    const task = this.tasks.find((t) => t.id === taskId);
    return {
      ...applicant,
      user: applicant.appliedUser,
      task: task
        ? {
            id: task.id,
            title: task.title,
            categories: task.categories,
            locations: task.locations,
          }
        : undefined,
    };
  }

  updateApplicationStatus(taskId: number, username: string, status: TaskApplicationStatus): void {
    // Päivitä hakemuksen status
    this.taskApplicants = this.taskApplicants.map((app) =>
      app.taskId === taskId && app.appliedUser.userName === username ? { ...app, applicationStatus: status } : app
    );
  }

  completeTaskExecution(taskId: number): void {
    // Merkitse työ valmiiksi mock-datassa
    this.tasks = this.tasks.map((task) =>
      task.id === taskId ? { ...task, status: "COMPLETED" as TaskStatus } : task
    );
  }

  fetchCategories(): CategoryResponse[] {
    // Palauta kaikki tunnetut kategoriat mock-datasta
    const categoryMap = new Map<string, CategoryResponse>(mockCategories.map((cat) => [cat.title, { ...cat }]));
    this.tasks.forEach((task) => {
      task.categories?.forEach((category) => {
        if (category?.title && !categoryMap.has(category.title)) {
          categoryMap.set(category.title, { title: category.title });
        }
      });
    });
    return Array.from(categoryMap.values());
  }

  private filterTasks(params: FetchTasksParams): PaginatedResponse<Task> {
    const { searchText, categories, minPrice, maxPrice, status, sortBy, page = 0, size = 10 } = params;
    let filtered = [...this.tasks];

    if (searchText?.trim()) {
      const normalized = searchText.toLowerCase();
      filtered = filtered.filter(
        (task) => task.title.toLowerCase().includes(normalized) || task.description.toLowerCase().includes(normalized)
      );
    }

    if (categories && categories.length > 0) {
      filtered = filtered.filter((task) => task.categories.some((cat) => categories.includes(cat.title)));
    }

    if (minPrice !== undefined) {
      filtered = filtered.filter((task) => task.price >= minPrice);
    }

    if (maxPrice !== undefined) {
      filtered = filtered.filter((task) => task.price <= maxPrice);
    }

    if (status) {
      filtered = filtered.filter((task) => task.status === status);
    }

    if (sortBy?.includes("price")) {
      filtered.sort((a, b) => (sortBy.endsWith("asc") ? a.price - b.price : b.price - a.price));
    } else if (sortBy?.includes("startDate")) {
      filtered.sort((a, b) =>
        sortBy.endsWith("asc")
          ? a.startDate.localeCompare(b.startDate)
          : b.startDate.localeCompare(a.startDate)
      );
    }

    return buildPaginatedResponse(filtered, page, size);
  }
}

export const mockApi = new MockApi();

declare global {
  interface Window {
    __PLAYWRIGHT_RESET_MOCK_API__?: boolean;
    __resetMockApi?: () => void;
  }
}

if (typeof window !== "undefined") {
  window.__resetMockApi = () => mockApi.reset(); // fixture kutsuu tätä init-skriptin kautta
  if (window.__PLAYWRIGHT_RESET_MOCK_API__) {
    mockApi.reset();
    delete window.__PLAYWRIGHT_RESET_MOCK_API__;
  }
}

export { isMockMode };
