// Siemendata in-memory mock-backendille: käyttäjä, tehtävät, hakemukset ja kategoriat
import type { PaginatedResponse, Task, TaskApplicant, UserDto, Category, CategoryResponse } from "../features/task/types";
import type { ApplicationWithDetails } from "../features/application/types";

export interface StoredApplication extends ApplicationWithDetails {
  id: string;
  taskId: number;
  applicantUsername: string;
}

export interface StoredTaskApplicant extends TaskApplicant {
  taskId: number;
}

export const mockUser: UserDto = {
  userName: "mock.user",
  mail: "mock.user@example.com",
  businessId: "1234567-8",
  phoneNumber: "+358401234567",
  address: "Mockikatu 1, 00100 Helsinki",
};

export const initialTasks: Task[] = [
  {
    id: 1,
    user: mockUser,
    categories: [{ title: "Cleaning" }],
    title: "Asunnon siivous",
    price: 80,
    startDate: "2025-03-10T09:00:00Z",
    endDate: "2025-03-10T12:00:00Z",
    locations: [
      {
        streetAddress: "Esimerkkikatu 1",
        postalCode: "00100",
        city: "Helsinki",
        country: "Suomi",
        latitude: 60.1699,
        longitude: 24.9384,
      },
    ],
    status: "ACTIVE",
    description: "Kaksion perusteellinen viikkosiivous keskustassa.",
  },
  {
    id: 2,
    user: mockUser,
    categories: [{ title: "Garden" }],
    title: "Pihan kevätsiivous",
    price: 150,
    startDate: "2025-03-15T08:00:00Z",
    endDate: "2025-03-15T16:00:00Z",
    locations: [
      {
        streetAddress: "Koivutie 5",
        postalCode: "02100",
        city: "Espoo",
        country: "Suomi",
        latitude: 60.2055,
        longitude: 24.6559,
      },
    ],
    status: "ACTIVE",
    description: "Pensaiden leikkaus, haravointi ja roskien keruu.",
  },
  {
    id: 3,
    user: mockUser,
    categories: [{ title: "Moving" }],
    title: "Muuttoapu",
    price: 200,
    startDate: "2025-03-20T07:00:00Z",
    endDate: "2025-03-20T15:00:00Z",
    locations: [
      {
        streetAddress: "Rautatienkatu 10",
        postalCode: "33100",
        city: "Tampere",
        country: "Suomi",
        latitude: 61.4981,
        longitude: 23.7608,
      },
    ],
    status: "ACTIVE",
    description: "Tarvitaan kaksi henkilöä auttamaan muutossa.",
  },
];

export const mockCategories: CategoryResponse[] = [ // mock-backendissa käytettävä kategoriavalikko
  "Cleaning",
  "Garden",
  "Moving",
  "Other",
  "Yard",
  "Forest work",
  "Household",
  "Repair",
  "Painting",
  "Snow removal",
].map((title) => ({ title }));

export const initialApplications: StoredApplication[] = [
  {
    id: "app-1",
    taskId: 1,
    applicantUsername: mockUser.userName,
    user: mockUser,
    categories: ["Cleaning"] as Category[],
    taskTitle: "Asunnon siivous",
    priceSuggestion: 75,
    timeSuggestion: "2025-03-10T09:00:00Z",
    description: "Voin aloittaa aikaisin aamulla.",
    applicationStatus: "PENDING",
    task: {
      id: 1,
      title: "Asunnon siivous",
      description: "Perusteellinen siivous",
      startDate: "2025-03-10T09:00:00Z",
      endDate: "2025-03-10T12:00:00Z",
    },
  },
  {
    id: "app-2",
    taskId: 2,
    applicantUsername: mockUser.userName,
    user: mockUser,
    categories: ["Garden"] as Category[],
    taskTitle: "Pihan kevätsiivous",
    priceSuggestion: 140,
    timeSuggestion: "2025-03-15T08:00:00Z",
    description: "Tuon omat välineet.",
    applicationStatus: "ACCEPTED",
    task: {
      id: 2,
      title: "Pihan kevätsiivous",
      description: "Pensaiden leikkaus",
      startDate: "2025-03-15T08:00:00Z",
      endDate: "2025-03-15T16:00:00Z",
    },
  },
];

export const initialTaskApplicants: StoredTaskApplicant[] = [
  {
    taskId: 1,
    appliedUser: {
      ...mockUser,
      userName: "worker.one",
      mail: "worker.one@example.com",
    },
    priceSuggestion: 90,
    createdAt: "2025-02-20T10:00:00Z",
    applicationStatus: "PENDING",
    timeSuggestion: "2025-03-10T09:00:00Z",
    description: "Olen käytettävissä koko päivän.",
  },
  {
    taskId: 1,
    appliedUser: {
      ...mockUser,
      userName: "worker.two",
      mail: "worker.two@example.com",
    },
    priceSuggestion: 85,
    createdAt: "2025-02-22T11:30:00Z",
    applicationStatus: "REJECTED",
    timeSuggestion: "2025-03-10T10:00:00Z",
    description: "Voin tuoda omat tarvikkeet.",
  },
];

export function buildPaginatedResponse<T>(
  items: T[],
  page = 0,
  size = items.length
): PaginatedResponse<T> {
  const start = page * size;
  const end = start + size;
  const sliced = items.slice(start, end);
  const totalPages = Math.max(1, Math.ceil(items.length / size));

  return {
    content: sliced,
    totalElements: items.length,
    totalPages,
    number: page,
    size,
    first: page === 0,
    last: page >= totalPages - 1,
    numberOfElements: sliced.length,
    empty: sliced.length === 0,
    pageable: {
      pageNumber: page,
      pageSize: size,
      offset: start,
      paged: true,
      unpaged: false,
      sort: {
        sorted: false,
        unsorted: true,
        empty: true,
      },
    },
    sort: {
      sorted: false,
      unsorted: true,
      empty: true,
    },
  };
}
