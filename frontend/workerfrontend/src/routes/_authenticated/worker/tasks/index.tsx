import { createFileRoute } from "@tanstack/react-router";
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
});

