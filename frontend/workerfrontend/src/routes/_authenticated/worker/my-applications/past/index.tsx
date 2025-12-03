import { createFileRoute } from "@tanstack/react-router";
import type { ApplicationFilters } from "../../../../../features/application/types";
import { useState } from "react";
import { useGetUserApplications } from "../../../../../features/application/hooks/useGetApplication";
import { ApplicationFilterPanel } from "../../../../../features/application/components/ApplicationFilterPanel";
import ApplicationToList from "../../../../../features/application/components/applicationsToList";
import { useWorkerApplicationTabs } from "../workerApplicationTabConfig";
import Tabulation from "../../../../../ui-library/Tabulation";

export const Route = createFileRoute("/_authenticated/worker/my-applications/past/")({
  component: PastApplicationsPage,
});

export default function PastApplicationsPage() {
  const [currentPage, setCurrentPage] = useState(0);
  const pageSize = 5;
  const [filters, setFilters] = useState<ApplicationFilters>({
    applicationStatus: "ACCEPTED",
  });
  const tabs = useWorkerApplicationTabs();

  const { data: paginatedResponse } = useGetUserApplications({
    page: currentPage,
    size: pageSize,
    ...filters,
    applicationStatus: "ACCEPTED",
  });

  const handleResetFilters = () => {
    setFilters((prev) => ({
      ...prev,
      applicationStatus: "ACCEPTED",
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
        <Tabulation tabs={tabs} />
      </div>
      <div className="container mx-auto px-6 py-8">
        <ApplicationFilterPanel
          filters={filters}
          onFiltersChange={(newFilters) => {
            setFilters((prev) => ({
              ...prev,
              ...newFilters,
              applicationStatus: "ACCEPTED",
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
