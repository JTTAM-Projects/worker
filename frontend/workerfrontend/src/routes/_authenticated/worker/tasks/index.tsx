import { createFileRoute, redirect } from "@tanstack/react-router";
import TaskPage from "../../../../pages/TaskPage";
import { z } from "zod";

const taskSearchSchema = z.object({
  page: z.number().optional(),
  view: z.enum(["list", "map"]).optional(),
  status: z.string().optional(),
  sortBy: z.string().optional(),
  searchText: z.string().optional(),
  categories: z.array(z.string()).optional(),
  minPrice: z.number().optional(),
  maxPrice: z.number().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  radiusKm: z.number().optional(),
  locationText: z.string().optional(),
});

export const Route = createFileRoute("/_authenticated/worker/tasks/")({
  component: TaskPage,
  validateSearch: taskSearchSchema,
  beforeLoad: ({ search }) => {
    // If URL has no search params, try to restore from sessionStorage
    if (Object.keys(search).length === 0) {
      try {
        const saved = sessionStorage.getItem("worker-tasks-search");
        if (saved) {
          const parsed = JSON.parse(saved);
          // Redirect to the same route with saved search params
          throw redirect({
            to: "/worker/tasks",
            search: parsed,
            replace: true,
          });
        }
      } catch (error) {
        // If it's not a redirect, ignore the error
        if (error instanceof Error && error.message === "REACT_ROUTER_REDIRECT") {
          throw error;
        }
      }
    }
  },
});
