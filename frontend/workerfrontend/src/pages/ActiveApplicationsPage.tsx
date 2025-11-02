import { useGetUserApplications } from "../features/application/hooks/useGetApplication";
import { useState } from 'react'
import ApplicationToList from "../features/application/components/applicationsToList";


export default function ActiveApplicationsPage() {
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(5);
  const [filters, setFilters] = useState({
    location: '',
    status: '',
    priceRange: [0, 1000]
  });

  const { data: paginatedResponse } = useGetUserApplications({
    page: currentPage,
    size: pageSize,
    applicationStatus: 'PENDING'
  });



/*   //debugging
  console.log('Raw userApplications:', userApplications);
  console.log('userApplications type:', typeof userApplications);
  console.log('userApplications keys:', userApplications ? Object.keys(userApplications) : 'no keys');
  console.log('First application structure:', paginatedResponse?.[0]); */

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(0); // Reset to first page when changing page size
  };

  return (
    <div className="min-h-screen align-center bg-gray-50">
      <div className="container mx-auto px-6 py-8">
        <div className="flex justify-center gap-8">
          {/* Filters */}
          <div className="w-full max-w-md bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-6">Suodattimet</h2>
            
            {/* Location Filter */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Hae</label>
              <input
                type="text"
                placeholder="Osoite"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
                value={filters.location}
                onChange={(e) => setFilters({...filters, location: e.target.value})}
              />
            </div>

            {/* Status Filter */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
                value={filters.status}
                onChange={(e) => setFilters({...filters, status: e.target.value})}
              >
                <option value="">Kaikki</option>
                <option value="PENDING">Odottaa</option>
                <option value="ACCEPTED">Hyväksytty</option>
                <option value="REJECTED">Hylätty</option>
              </select>
            </div>

            {/* Price Range */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Hintahaarukka</label>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">0€</span>
                <input
                  type="range"
                  min="0"
                  max="1000"
                  value={filters.priceRange[1]}
                  onChange={(e) => setFilters({...filters, priceRange: [0, parseInt(e.target.value)]})}
                  className="flex w-full h-2 appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-green-600 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-green-600 [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white [&::-moz-range-thumb]:shadow-md"
                />
                <span className="text-sm text-gray-600">{filters.priceRange[1]}€</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <button className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">
                Nollaa
              </button>
              <button className="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
                Hae
              </button>
            </div>
          </div>
        </div>
        <div className="flex-1">
            <ApplicationToList 
              applications={paginatedResponse?.content || []}
              totalPages={paginatedResponse?.totalPages || 0}
              totalElements={paginatedResponse?.totalElements || 0}
              currentPage={paginatedResponse?.number || 0}
              pageSize={paginatedResponse?.pageable?.pageSize || pageSize}
              onPageChange={handlePageChange}
              onPageSizeChange={handlePageSizeChange}
              isFirst={paginatedResponse?.first || true}
              isLast={paginatedResponse?.last || true}
            />
          </div>
      </div>
    </div>
  );
}
