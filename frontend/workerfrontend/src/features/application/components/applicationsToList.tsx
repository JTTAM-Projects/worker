import type { ApplicationWithDetails } from "../types"
import { formatDate, formatTime } from "../../../utils/generalFunctions";
import { flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";

interface ApplicationListProps {
  applications: ApplicationWithDetails[]
}
export default function ApplicationToList ({ applications }: ApplicationListProps) {

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
          <div className="flex items-center gap-3 max-w-200">
            {/* Left side - Image placeholder */}
            <div className="w-20 h-20 bg-green-600 rounded-lg flex-shrink-0 flex items-center justify-center">
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
  });
  
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
    </div>
  );
}