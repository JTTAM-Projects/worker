import { createFileRoute, useNavigate } from "@tanstack/react-router";
import type { ApplicationFilters } from "../../../../../features/application/types";
import { useState } from "react";
import { ApplicationFilterPanel } from "../../../../../features/application/components/ApplicationFilterPanel";
import ApplicationToList from "../../../../../features/application/components/applicationsToList";
import { applicationQueries } from "../../../../../features/application/queries/applicationQueries";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useAuth } from "../../../../../auth/useAuth";

export const Route = createFileRoute("/_authenticated/worker/my-applications/active/")({
  component: ActiveApplicationsPage,
  loader: async ({ context }) => {
    try {
      return await context.queryClient.ensureQueryData(
        applicationQueries.ownApplications(context.auth.getAccessToken, {
          page: 0,
          size: 5,
          applicationStatus: "PENDING",
        })
      );
    } catch (error) {
      console.error('Failed to load applications:', error);
      // Return empty data on error to prevent crash
      return { content: [], totalPages: 0, number: 0, first: true, last: true };
    }
  },
});

export default function ActiveApplicationsPage() {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(0);
  const pageSize = 5;
  const { getAccessTokenSilently } = useAuth();
  const [filters, setFilters] = useState<ApplicationFilters>({
    applicationStatus: "PENDING",
  });

  const { data: paginatedResponse } = useSuspenseQuery(
    applicationQueries.ownApplications(getAccessTokenSilently, {
      applicationStatus: "PENDING",
      page: currentPage,
      size: pageSize,
    })
  );

  const handleResetFilters = () => {
    setFilters((prev) => ({
      ...prev,
      applicationStatus: "PENDING",
      searchText: undefined,
      categories: undefined,
      minPrice: undefined,
      maxPrice: undefined,
    }));
  };

  const handlePageChange = (page: number) => setCurrentPage(page);

  return (
    <div className="min-h-screen align-center bg-gray-50">
      <div className="flex mt-5 justify-center">
        <button
          className={"py-2 px-4 text-sm font-medium text-green-600 border-b-2 border-green-600"}
          onClick={() => navigate({ to: "/worker/my-applications/active" })}
        >
          Aktiiviset
        </button>
        <button
          className={"py-2 px-4 text-sm font-medium text-gray-500 hover:text-gray-700"}
          onClick={() => navigate({ to: "/worker/my-applications/past" })}
        >
          Menneet
        </button>
        <button
          className={"py-2 px-4 text-sm font-medium text-gray-500 hover:text-gray-700"}
        >
          Työtarjoukset
        </button>
      </div>
      <div className="container mx-auto px-6 py-8">
        <ApplicationFilterPanel
          filters={filters}
          onFiltersChange={(newFilters) => {
            setFilters((prev) => ({
              ...prev,
              ...newFilters,
              applicationStatus: "PENDING",
            }));
            setCurrentPage(0);
          }}
          onReset={handleResetFilters}
        />

        <div className="flex-1">
          <ApplicationToList
            applications={paginatedResponse?.content || []}
            totalPages={paginatedResponse?.totalPages || 0}
            currentPage={paginatedResponse?.number || 0}
            onPageChange={handlePageChange}
            isFirst={paginatedResponse?.first || true}
            isLast={paginatedResponse?.last || true}
          />
        </div>
      </div>
    </div>
  );
}
