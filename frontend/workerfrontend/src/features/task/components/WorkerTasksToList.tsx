import { useNavigate } from "@tanstack/react-router";
import type { CategoryResponse, LocationResponse } from "../types";

interface TaskUser {
  userName: string;
  mail: string;
  businessId?: string;
  phoneNumber?: string;
  address?: string;
  createdAt?: string | null;
}
export interface WorkerTask {
  id: number;
  user: TaskUser;
  categories: CategoryResponse[];
  title: string;
  price: number;
  startDate: string;
  endDate: string;
  locations: LocationResponse[];
  status: string; // ACTIVE etc.
  description?: string;
}

interface WorkerTasksListProps {
  tasks: WorkerTask[];
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  isFirst: boolean;
  isLast: boolean;
}

const getCategoryIcon = (title: string) => {
  switch (title?.toUpperCase()) {
    case "REPAIR":
      return "build";
    case "CLEANING":
      return "cleaning_services";
    case "MOVING":
      return "local_shipping";
    case "PAINTING":
      return "format_paint";
    case "SNOW REMOVAL":
      return "ac_unit";
    case "FOREST WORK":
      return "park";
    case "YARD":
      return "yard";
    default:
      return "work";
  }
};

const getCategoryColor = (title: string) => {
  switch (title?.toUpperCase()) {
    case "REPAIR":
    case "PAINTING":
      return "bg-orange-200";
    case "CLEANING":
    case "HOUSEHOLD":
      return "bg-blue-200";
    case "MOVING":
      return "bg-purple-200";
    case "SNOW REMOVAL":
      return "bg-cyan-200";
    case "FOREST WORK":
    case "GARDEN":
    case "YARD":
      return "bg-green-200";
    default:
      return "bg-gray-200";
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "ACTIVE":
      return "bg-yellow-600 text-black";
    case "COMPLETED":
      return "bg-green-600 text-black";
    case "CANCELLED":
      return "bg-red-600 text-black";
    case "PENDING_APPROVAL":
      return "bg-yellow-300 text-black";
    case "IN_PROGRESS":
      return "bg-yellow-400 text-black";
    default:
      return "bg-red-500 text-black";
  }
};

const translateStatus = (status: string) => {
  switch (status) {
    case "ACTIVE":
      return "Aktiivinen";
    case "COMPLETED":
      return "Valmis";
    case "CANCELLED":
      return "Peruttu";
    case "PENDING_APPROVAL":
      return "Odottaa hyv.";
    case "IN_PROGRESS":
      return "Työn alla";
    default:
      return "ERROR";
  }
};

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("fi-FI", { day: "numeric", month: "numeric", year: "numeric" });

const formatTime = (iso: string) => new Date(iso).toLocaleTimeString("fi-FI", { hour: "2-digit", minute: "2-digit" });

export default function WorkerTasksToList({
  tasks,
  totalPages,
  currentPage,
  onPageChange,
  isFirst,
  isLast,
}: WorkerTasksListProps) {
  const navigate = useNavigate();

  const renderTaskCard = (task: WorkerTask, index: number) => {
    const primaryCategory = task.categories?.[0]?.title ?? "OTHER";
    const categoryIcon = getCategoryIcon(primaryCategory);
    const categoryBg = getCategoryColor(primaryCategory);
    const location = task.locations?.[0];
    const locationLabel = location
      ? [location.streetAddress, location.city?.toUpperCase(), location.postalCode].filter(Boolean).join(" ") ||
        "Ei sijaintitietoja"
      : "Ei sijaintitietoja";

    return (
      <div
        key={task.id ?? index}
        className="bg-white rounded-lg border border-gray-200 transition-all duration-200 hover:shadow-lg hover:border-green-400 cursor-pointer overflow-hidden"
        onClick={() => navigate({ to: "/worker/own-tasks/$taskId", params: { taskId: task.id.toString() } })}
      >
        <div className="flex items-start justify-between gap-6">
          {/* LEFT: icon + status + categories */}
          <div className="flex items-start gap-4 flex-shrink-0 pr-2">
            <div className={`w-32 h-32 ${categoryBg} rounded-md flex items-center justify-center`}>
              <span className="material-icons text-gray-600 text-4xl">{categoryIcon}</span>
            </div>
            <div className="pt-4">
              <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                {translateStatus(task.status)}
              </span>
              {task.categories?.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {task.categories.map((category, catIndex) => (
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

          {/* MIDDLE: details */}
          <div className="flex-1 mt-2 min-w-0">
            <h3 className="text-xl font-bold text-gray-800 mb-1">{task.title}</h3>
            <div className="flex items-center text-gray-600 text-sm mb-1">
              <span className="material-icons text-green-500 text-sm mr-1">location_on</span>
              <span>{locationLabel}</span>
            </div>
            <div className="flex items-center text-gray-600 text-sm mb-1">
              <span className="material-icons text-green-500 text-sm mr-1">event</span>
              <span>
                {formatDate(task.startDate)} - {formatDate(task.endDate)}
              </span>
            </div>
            <div className="flex items-center text-gray-600 text-sm">
              <span className="material-icons text-green-500 text-sm mr-1">schedule</span>
              <span>
                {formatTime(task.startDate)} - {formatTime(task.endDate)}
              </span>
            </div>
          </div>

          {/* RIGHT: price */}
          <div className="text-right pt-9 pr-5 flex-shrink-0">
            <div className="text-green-600 font-bold text-xl whitespace-nowrap">{task.price} €</div>
            <div className="text-sm font-bold text-gray-600 whitespace-nowrap">Hinta</div>
          </div>
        </div>
      </div>
    );
  };

  const getPageNumbers = () => {
    const pages: number[] = [];
    const maxVisible = 5;
    let start = Math.max(0, currentPage - Math.floor(maxVisible / 2));
    const end = Math.min(totalPages - 1, start + maxVisible - 1);
    if (end - start < maxVisible - 1) start = Math.max(0, end - maxVisible + 1);
    for (let p = start; p <= end; p++) pages.push(p);
    return pages;
  };

  return (
    <section className="bg-white rounded-lg shadow-lg p-6 md:p-8 max-w-6xl mx-auto">
      <div className="mb-4 text-gray-600 text-center">{tasks.length > 0 ? "" : "Ei näytettäviä tehtäviä"}</div>
      <div className="space-y-4">
        {tasks.map((t, i) => renderTaskCard(t, i))}
        <div className="flex items-center justify-center mt-6">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={isFirst}
              className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors border-2 ${
                isFirst
                  ? "text-gray-500 bg-white border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                  : "bg-green-500 text-white hover:bg-green-600"
              }`}
            >
              <span className="material-icons text-sm mr-1">chevron_left</span>
              Edellinen
            </button>
            {getPageNumbers().map((p) => (
              <button
                key={p}
                onClick={() => onPageChange(p)}
                className={`px-3 py-2 text-sm font-medium ${
                  p === currentPage ? "text-green-600 font-bold" : "text-gray-600"
                }`}
              >
                {p + 1} / {totalPages}
              </button>
            ))}
            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={isLast}
              className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors border-2 ${
                isLast
                  ? "text-gray-500 bg-white border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
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
