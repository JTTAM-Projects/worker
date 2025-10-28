import type { ApplicationWithDetails } from "../types"
import { formatDate, formatTime } from "../../../utils/generalFunctions";
import { flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";

interface ApplicationListProps {
  applications: ApplicationWithDetails[];
  totalPages: number;
  totalElements: number;
  currentPage: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  isFirst: boolean;
  isLast: boolean;
}
export default function ApplicationToList ({ 
  applications,
  totalPages, 
  totalElements, 
  currentPage, 
  pageSize, 
  onPageChange, 
  onPageSizeChange,
  isFirst,
  isLast
}: ApplicationListProps) {

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-500 text-white';
      case 'ACCEPTED': return 'bg-green-500 text-white';
      case 'REJECTED': return 'bg-red-500 text-white';
      case 'WITHDRAWN': return 'bg-gray-500 text-white';
      default: return 'bg-blue-500 text-white';
    }
  };

  const columns = [
    {
      accessorKey: 'taskTitle',
      cell: ({ row }) =>{
        const a = row.original;
        return ( 
        <div
          key={`application-${row.id}`}
          className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl border border-green-300 p-4 hover:shadow-lg transition-all duration-300 cursor-pointer"
        >
          <div className="flex items-center gap-4">
            {/* Left side - Image placeholder */}
            <div className="w-16 h-16 bg-green-600 rounded-lg flex-shrink-0 flex items-center justify-center">
              <span className="text-white text-2xl font-bold">
                {a.taskTitle.charAt(0).toUpperCase()}
              </span>
            </div>

            {/* Middle - Content */}
            <div className="flex-1 max-w-30">
              {/* Status badge */}
              <div className="mb-4">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(a.applicationStatus)}`}>
                  {a.applicationStatus}
                </span>
                {/* Categories */}
                {a.categories && a.categories.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {a.categories.map((category: any, catIndex: number) => (
                      <span 
                        key={catIndex}
                        className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded"
                      >
                        {category.title}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex-4 max-w-60 mt-4">

              {/* Task title */}
              <h3 className="text-xl font-bold text-gray-800 mb-1">
                {a.taskTitle}
              </h3>

              {/* Location info */}
              <div className="flex items-center text-gray-600 text-sm mb-1">
                <span className="material-icons text-sm mr-1">location_on</span>
                <span>Sijainti ei saatavilla</span>
              </div>

              {/* Date */}
              <div className="flex items-center text-gray-600 text-sm mb-1">
                <span className="material-icons text-sm mr-1">event</span>
                <span>{formatDate(a.timeSuggestion)}</span>
              </div>

              <div className="flex items-center text-gray-600 text-sm">
                <span className="material-icons text-sm mr-1">schedule</span>
                <span>{formatTime(a.timeSuggestion)}</span>
              </div>
            </div>

            {/* Right side - Price */}
            <div className="text-right flex-shrink-0">
              <div className="text-2xl font-bold text-gray-800">
                {a.priceSuggestion} €
              </div>
              <div className="text-sm text-gray-600">
                Hintaehdotus
              </div>
            </div>
          </div>
        </div>
      )}
    }
  ];

  const table = useReactTable({
    data: applications || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    pageCount: totalPages,
  });

  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(0, currentPage - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(totalPages - 1, startPage + maxVisiblePages - 1);

    if (endPage - startPage < maxVisiblePages - 1) {
      startPage = Math.max(0, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++){
      pages.push(i);
    }
    
    return pages;
  }
  
  return (
    <div className="space-y-4">
      {table.getRowModel().rows.map(row => (
        <div key={row.id}>
          {row.getVisibleCells().map(cell => (
            <div key={cell.id}>
              {flexRender(cell.column.columnDef.cell, cell.getContext())}
            </div>
          ))}
        </div>
      ))}
      {/* Pagination Controls */}
{/*       {totalPages > 1 && ( */}
        <div className="flex items-center justify-between mt-6">
          {/* Left side - Info */}
          <div className="text-sm text-gray-700">
            Näytetään {Math.min((currentPage * pageSize) + 1, totalElements)} - {Math.min((currentPage + 1) * pageSize, totalElements)} / {totalElements} tulosta
          </div>

          {/* Page numbers */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onPageChange(0)}
              disabled={isFirst}
              className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Ensimmäinen
            </button>

            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={isFirst}
              className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Edellinen
            </button>

            {getPageNumbers().map(pageNum => (
              <button
                key={pageNum}
                onClick={() => onPageChange(pageNum)}
                className={`px-3 py-2 text-sm font-medium border rounded-md ${
                  pageNum === currentPage
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'text-gray-500 bg-white border-gray-300 hover:bg-gray-50'
                }`}
              >
                {pageNum + 1}
              </button>
            ))}

            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={isLast}
              className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Seuraava
            </button>

            <button
              onClick={() => onPageChange(totalPages - 1)}
              disabled={isLast}
              className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Viimeinen
            </button>
          </div>

          {/* Right side - Page size selector */}
          <div className="flex items-center space-x-2">
            <label className="text-sm text-gray-700">Rivejä per sivu:</label>
            <select
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              className="border border-gray-300 rounded-md px-2 py-1 text-sm"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>
        </div>
{/*       )} */}
    </div>
  );
}