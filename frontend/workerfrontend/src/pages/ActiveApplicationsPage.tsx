import { useGetUserApplications } from "../features/application/hooks/useGetApplication";
import { useEffect, useState } from 'react'
import ApplicationToList from "../features/application/components/applicationsToList";
import { ApplicationFilterPanel } from "../features/application/components/ApplicationFilterPanel";
import type { ApplicationFilters, ApplicationStatus } from "../features/application/types";

type TabKey = 'active' | 'accepted' | 'jobOffers';

export default function ActiveApplicationsPage() {
  const [currentPage, setCurrentPage] = useState(0);
  const pageSize = 5;
  const [filters, setFilters] = useState<ApplicationFilters>({
    applicationStatus: "PENDING",
  });
  const [tab, setTab] = useState<TabKey>('active')

  useEffect(() => {
    const statusByTab: Record<Exclude<TabKey, 'jobOffers'>, ApplicationStatus> = {
      active: 'PENDING',
      accepted: 'ACCEPTED',
    };
    if (tab !== 'jobOffers'){
      setFilters(prev => ({ ...prev, applicationStatus: statusByTab[tab] }));
      setCurrentPage(0);
    } else {
      setFilters(prev => ({
        ...prev,
        applicationStatus: undefined,
      }));
      setCurrentPage(0)
    }
  }, [tab]);
  
  const { data: paginatedResponse } = useGetUserApplications({
    page: currentPage,
    size: pageSize,
    ...filters,
    applicationStatus: filters.applicationStatus ?? (tab === 'accepted' ? 'ACCEPTED' : 'PENDING'),
  });
  
  const handleResetFilters = () => {
    setFilters(prev => ({
      ...prev,
      applicationStatus: tab === 'accepted' ? 'ACCEPTED' : 'PENDING',
      searchText: undefined,
      categories: undefined,
      minPrice: undefined,
      maxPrice: undefined
    }))
  }

  const handlePageChange = (page: number) => setCurrentPage(page);

  return (
    <div className="min-h-screen align-center bg-gray-50">
      <div className="flex mt-5 justify-center">
        <button
            className={`py-2 px-4 text-sm font-medium ${
                tab === 'active'
                    ? 'text-green-600 border-b-2 border-green-600'
                    : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setTab('active')}
        >
        Aktiiviset
        </button>
        <button
            className={`py-2 px-4 text-sm font-medium ${
                tab === 'accepted'
                    ? 'text-green-600 border-b-2 border-green-600'
                    : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setTab('accepted')}
        >
        Menneet
        </button>
        <button
            className={`py-2 px-4 text-sm font-medium ${
                tab === 'jobOffers'
                    ? 'text-green-600 border-b-2 border-green-600'
                    : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setTab('jobOffers')}
        >
        Työtarjoukset
        </button>
      </div>
      <div className="container mx-auto px-6 py-8">
        {tab !== 'jobOffers' ? (
          <>
            <ApplicationFilterPanel
              filters={filters}
              onFiltersChange={(newFilters) => {
                setFilters(prev => ({
                  ...prev,
                  ...newFilters,
                  applicationStatus: tab === 'accepted' ? 'ACCEPTED' : 'PENDING',
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
          </>
        ) : (
          <div className="max-w-4xl mx-auto mt-8 bg-white border border-dashed border-gray-300 rounded-lg p-8 text-center text-gray-500">
            Työtarjoukset eivät ole vielä saatavilla.
          </div>
        )}
      </div>
    </div>
  );
}
