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
      case "OTHER":
        return "handyman";
      default:
        return "work";
    }
  };

  const getLocationString = (location: LocationResponse | string | null | undefined): string => {
    if (!location) return "Ei sijaintia";
    if (typeof location === "string") return location;
    return location.city || "Ei sijaintia";
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

      {/* Single Column List */}
      <div className="space-y-4 mb-6 max-w-4xl mx-auto">
        {tasks.map((t) => {
          const firstCategory = t.categories?.[0]?.title || "OTHER";
          const locationStr = getLocationString(t.location);

          return (
            <div
              key={t.id}
              className="bg-gradient-to-br from-white to-gray-50 rounded-xl border-2 border-gray-200 p-6 hover:shadow-xl hover:border-green-400 hover:scale-105 transition-all duration-300 cursor-pointer"
              onClick={() => navigate(`/tasks/${t.id}`)}
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                {/* Left Section: Title, Description, and Category */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="material-icons text-green-500 text-3xl">
                      {getCategoryIcon(firstCategory)}
                    </span>
                    <h4 className="font-bold text-gray-800 text-xl">{t.title}</h4>
                  </div>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2 ml-11">
                    {t.description}
                  </p>
                  <div className="flex flex-wrap items-center gap-4 ml-11">
                    <span className="flex items-center text-sm text-gray-600">
                      <span className="material-icons mr-1 text-green-500 text-lg">
                        place
                      </span>
                      {locationStr}
                    </span>
                    <span className="flex items-center text-sm text-gray-600">
                      <span className="material-icons mr-1 text-green-500 text-lg">
                        event
                      </span>
                      {formatDate(t.startDate)}
                    </span>
                  </div>
                </div>

                {/* Right Section: Price */}
                <div className="flex items-center justify-end md:justify-center">
                  <span className="text-green-600 font-bold text-2xl">
                    {t.price} €
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
