import type { Task, LocationResponse } from "../types";
import { useNavigate } from "react-router-dom";

interface TaskListProps {
  tasks: Task[];
}

export default function TaskList({ tasks }: TaskListProps) {
  const navigate = useNavigate();

  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleDateString("fi-FI", {
      day: "numeric",
      month: "long",
    });
  };

  const getCategoryIcon = (categoryTitle: string) => {
    switch (categoryTitle?.toUpperCase()) {
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

  const getLocationString = (location: LocationResponse | string | null | undefined): string => {
    if (!location) return "Ei sijaintia";
    if (typeof location === "string") return location;
    return location.city || "Ei sijaintia";
  };

  /**
   * Get initials from username for avatar fallback
   */
  const getUserInitials = (userName: string): string => {
    if (!userName) return "?";
    const parts = userName.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return userName.substring(0, 2).toUpperCase();
  };

  return (
    <section className="bg-white rounded-lg shadow-lg p-6 md:p-8">
      {/* Task Count */}
      <div className="mb-4 text-gray-600 max-w-4xl mx-auto">
        {tasks.length > 0 ? (
          <span>Näytetään {tasks.length} tehtävää</span>
        ) : (
          <span>Ei tehtäviä näytettävänä</span>
        )}
      </div>

      {/* Task List - Two Column Layout */}
      <div className="space-y-4 mb-6 max-w-4xl mx-auto">
        {tasks.map((t) => {
          const firstCategory = t.categories?.[0]?.title || "OTHER";
          const locationStr = getLocationString(t.location);
          const categoryIcon = getCategoryIcon(firstCategory);
          const categoryBg = getCategoryColor(firstCategory);

          return (
            <div
              key={t.id}
              className="bg-white rounded-lg border border-gray-200 hover:shadow-lg hover:border-green-400 transition-all duration-200 cursor-pointer overflow-hidden"
              onClick={() => navigate(`/tasks/${t.id}`)}
            >
              <div className="flex">
                {/* LEFT COLUMN: Image/Icon Area (Square) */}
                <div className={`w-40 h-40 flex-shrink-0 ${categoryBg} flex items-center justify-center`}>
                  {/* TODO: Replace with task image when available */}
                  {/* For now, show category icon */}
                  <span className="material-icons text-gray-600 text-5xl">
                    {categoryIcon}
                  </span>
                </div>

                {/* RIGHT COLUMN: Content Area (Flexible) */}
                <div className="flex-1 p-4 flex flex-col justify-between min-h-[160px]">
                  
                  {/* ZONE 1: Title & Price */}
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <h3 className="font-bold text-gray-800 text-lg leading-tight flex-1">
                      {t.title}
                    </h3>
                    <span className="text-green-600 font-bold text-xl whitespace-nowrap">
                      {t.price} €
                    </span>
                  </div>

                  {/* ZONE 2: Metadata (Location & Date) */}
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-4 text-sm text-gray-600">
                    <span className="flex items-center">
                      <span className="material-icons text-green-500 text-base mr-1">
                        place
                      </span>
                      {locationStr}
                    </span>
                    <span className="flex items-center">
                      <span className="material-icons text-green-500 text-base mr-1">
                        event
                      </span>
                      {formatDate(t.startDate)}
                    </span>
                  </div>

                  {/* ZONE 3: Poster Info (Bottom) */}
                  <div className="flex items-center gap-3 pt-3 border-t border-gray-100">
                    {/* Avatar Circle */}
                    <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white font-medium text-sm flex-shrink-0">
                      {getUserInitials(t.user.userName)}
                    </div>
                    
                    {/* Username */}
                    <span className="text-sm text-gray-700 font-medium">
                      {t.user.userName}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
