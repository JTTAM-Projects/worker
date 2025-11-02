import { useGetUserApplications } from "../features/application/hooks/useGetApplication";
import { useEffect, useState } from 'react'
import ApplicationToList from "../features/application/components/applicationsToList";
import { ApplicationFilterPanel } from "../features/application/components/ApplicationFilterPanel";
import type { ApplicationFilters, ApplicationStatus } from "../features/application/types";


export default function ActiveApplicationsPage() {
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(5);
  const [filters, setFilters] = useState<ApplicationFilters>({
    applicationStatus: "PENDING",
});
  const [status, setStatus] = useState<ApplicationStatus>();
  const [tab, setTab] = useState<ApplicationStatus>("PENDING")

  const handleResetFilters = () => {
    const resetFilters: ApplicationFilters = {
      applicationStatus: status
    }
    setFilters(resetFilters);
    setCurrentPage(0);
  }

  const { data: paginatedResponse } = useGetUserApplications({
    page: currentPage,
    size: pageSize,
    ...filters,
    applicationStatus: filters.applicationStatus ?? tab,
  });

/*   //debugging
  console.log('Raw userApplications:', userApplications);
  console.log('userApplications type:', typeof userApplications);
  console.log('userApplications keys:', userApplications ? Object.keys(userApplications) : 'no keys');
  console.log('First application structure:', paginatedResponse?.[0]); */
  useEffect(() => {
    setStatus(tab)
  }, [tab]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="min-h-screen align-center bg-gray-50">
      <div className="container mx-auto px-6 py-8">
        <ApplicationFilterPanel
          filters={filters}
          onFiltersChange={(newFilters) => {
            setFilters(newFilters);
            setCurrentPage(0);
          }}
          onReset={handleResetFilters}
        />
        <div className="flex-1">
            <ApplicationToList 
              applications={paginatedResponse?.content || []}
              totalPages={paginatedResponse?.totalPages || 0}
              totalElements={paginatedResponse?.totalElements || 0}
              currentPage={paginatedResponse?.number || 0}
              pageSize={paginatedResponse?.pageable?.pageSize || pageSize}
              onPageChange={handlePageChange}
              isFirst={paginatedResponse?.first || true}
              isLast={paginatedResponse?.last || true}
            />
          </div>
      </div>
    </div>
  );
}
