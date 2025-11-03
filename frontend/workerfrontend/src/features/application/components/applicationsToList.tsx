import type { ApplicationWithDetails } from "../types";
import { formatDate, formatTime } from "../../../utils/generalFunctions";
import { useNavigate } from "react-router-dom";

type ApplicationListRow = ApplicationWithDetails & {
  task?: {
    id: number;
    title: string;
    categories?: Array<{ title: string }>;
    locations?: Array<{
      streetAddress?: string;
      postalCode?: string;
      city?: string;
    }>;
  };
};

interface ApplicationListProps {
  applications: ApplicationListRow[];
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  isFirst: boolean;
  isLast: boolean;
}
export default function ApplicationToList({
  applications,
  totalPages,
  currentPage,
  onPageChange,
  isFirst,
  isLast,
}: ApplicationListProps) {

  const navigate = useNavigate();
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-500 text-white';
      case 'ACCEPTED': return 'bg-green-500 text-white';
      case 'REJECTED': return 'bg-red-500 text-white';
      case 'WITHDRAWN': return 'bg-gray-500 text-white';
      default: return 'bg-blue-500 text-white';
    }
  };

  const getCategoryIcon = (title: string) => {
    switch (title?.toUpperCase()) {
      case "GARDEN":
        return "yard";
      case "CLEANING":
        return "cleaning_services";
      case "MOVING":
        return "local_shipping";
      case "HOUSEHOLD":
        return "home";
      case "REPAIR":
        return "build";
      case "PAINTING":
        return "format_paint";
      case "SNOW REMOVAL":
        return "ac_unit";
      case "FOREST WORK":
        return "park";
      case "YARD":
        return "grass";
      case "OTHER":
        return "handyman";
      default:
        return "work";
    }
  };

  const translateStatus = (status: string) => {
    switch (status) {
      case 'PENDING': return 'Aktiivinen';
      case 'ACCEPTED': return 'Hyväksytty';
      case 'REJECTED': return 'Hylätty';
      case 'WITHDRAWN': return 'Poistettu';
      default: return 'bg-blue-500 text-white';
    }
  }
  const getCategoryColor = (categoryTitle: string) => {
    switch (categoryTitle?.toUpperCase()) {
      case "GARDEN":
      case "YARD":
      case "FOREST WORK":
        return "bg-green-100";
      case "CLEANING":
      case "HOUSEHOLD":
        return "bg-blue-100";
      case "MOVING":
        return "bg-purple-100";
      case "REPAIR":
      case "PAINTING":
        return "bg-orange-100";
      case "SNOW REMOVAL":
        return "bg-cyan-100";
      case "OTHER":
      default:
        return "bg-gray-100";
    }
  };

  const renderApplicationCard = (application: ApplicationListRow, index: number) => {
    const categories =
      application.task?.categories ??
      application.categories?.map((title) => ({ title })) ??
      [];
    const primaryCategory = categories[0]?.title ?? "OTHER";
    const categoryIcon = getCategoryIcon(primaryCategory);
    const categoryBg = getCategoryColor(primaryCategory);
    const taskId = application.task?.id;
    const isClickable = typeof taskId === "number";

    const location = application.task?.locations?.[0];
    const locationLabel = location
      ? [location.streetAddress, location.city?.toUpperCase(), location.postalCode]
          .filter(Boolean)
          .join(" ") || "Ei sijaintitietoja"
      : "Ei sijaintitietoja";

    return (
      <div
        key={taskId ?? index}
        className={`bg-white rounded-lg border border-gray-200 transition-all duration-200 ${
          isClickable
            ? "hover:shadow-lg hover:border-green-400 cursor-pointer"
            : "cursor-default"
        } overflow-hidden`}
        onClick={isClickable ? () => navigate(`/applications/task/${taskId}`, { state: { application , taskId: application?.task?.id}}) : undefined}
      >
        <div className="flex items-start justify-between gap-6">
          <div className="flex items-start gap-4 flex-shrink-0 pr-2">
            <div className={`w-32 h-32 ${categoryBg} rounded-md flex items-center justify-center`}>
              <span className="material-icons text-gray-600 text-4xl">{categoryIcon}</span>
            </div>
            <div className="pt-4">
              <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(application.applicationStatus)}`}>
                {translateStatus(application.applicationStatus)}
              </span>
              {categories.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {categories.map((category, catIndex) => (
                    <span
                      key={`${category.title}-${catIndex}`}
                      className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded"
                    >
                      {category.title}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="flex-1 mt-2 min-w-0">
            <h3 className="text-xl font-bold text-gray-800 mb-1">
              {application.task?.title ?? application.taskTitle}
            </h3>
            <div className="flex items-center text-gray-600 text-sm mb-1">
              <span className="material-icons text-green-500 text-sm mr-1">location_on</span>
              <span>{locationLabel}</span>
            </div>
            <div className="flex items-center text-gray-600 text-sm mb-1">
              <span className="material-icons text-green-500 text-sm mr-1">event</span>
              <span>{formatDate(application.timeSuggestion)}</span>
            </div>
            <div className="flex items-center text-gray-600 text-sm">
              <span className="material-icons text-green-500 text-sm mr-1">schedule</span>
              <span>{formatTime(application.timeSuggestion)}</span>
            </div>
          </div>
          <div className="text-right pt-9 pr-5 flex-shrink-0">
            <div className="text-green-600 font-bold text-xl whitespace-nowrap">
              {application.priceSuggestion} €
            </div>
            <div className="text-sm font-bold text-gray-600 whitespace-nowrap">
              Hintaehdotus
            </div>
          </div>
        </div>
      </div>
    );
  };

  const getPageNumbers = () => {
    const pages: number[] = [];
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
    <section className="bg-white rounded-lg shadow-lg p-6 md:p-8 max-w-4xl mx-auto">
      <div className="space-y-4">
        {applications.map((application, index) =>
          renderApplicationCard(application, index)
        )}
          <div className="flex items-center justify-center mt-6">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={isFirst}
                className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors border-2 ${
                  isFirst
                    ? "text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    : "bg-green-500 text-white hover:bg-green-600"
                    }`}
              >                
                <span className="material-icons text-sm ml-1">chevron_left</span>
                Edellinen
              </button>

              {getPageNumbers().map(pageNum => (
                <button
                  key={pageNum}
                  onClick={() => onPageChange(pageNum)}
                  className="px-3 py-2 text-sm font-medium" 
                >
                  {pageNum + 1} / {totalPages}
                </button>
              ))}

              <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={isLast}
                className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors border-2 ${
                  isLast
                    ? "text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    : "bg-green-500 text-white hover:bg-green-600"
                    }`}
              >
                Seuraava
                <span className="material-icons text-sm ml-1">chevron_right</span>
              </button>
            </div>
          </div>
      </div>
    </section>
  );
}
