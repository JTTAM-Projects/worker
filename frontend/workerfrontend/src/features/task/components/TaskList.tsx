import type { Task } from "../types";

interface TaskListProps {
  tasks: Task[];
}

export default function TaskList({ tasks }: TaskListProps) {
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

  const getLocationString = (location: any): string => {
    if (!location) return "Ei sijaintia";
    if (typeof location === "string") return location;
    return location.city || "Ei sijaintia";
  };

  return (
    <section className="bg-white rounded-lg shadow-lg p-6 md:p-8">
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tasks.map((t) => {
          const firstCategory = t.categories?.[0]?.title || "OTHER";
          const locationStr = getLocationString(t.location);

          return (
            <div
              key={t.id}
              className="bg-gradient-to-br from-white to-gray-50 rounded-xl border-2 border-gray-200 p-6 hover:shadow-xl hover:border-green-400 hover:scale-105 transition-all duration-300 cursor-pointer"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="material-icons text-green-500 text-2xl">
                    {getCategoryIcon(firstCategory)}
                  </span>
                  <h4 className="font-bold text-gray-800 text-lg">{t.title}</h4>
                </div>
              </div>

              <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                {t.description}
              </p>

              <div className="flex items-center justify-between mb-3">
                <span className="flex items-center text-sm text-gray-600">
                  <span className="material-icons mr-1 text-green-500 text-lg">
                    place
                  </span>
                  {locationStr}
                </span>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                <span className="flex items-center text-sm text-gray-600">
                  <span className="material-icons mr-1 text-green-500 text-lg">
                    event
                  </span>
                  {formatDate(t.startDate)}
                </span>
                <span className="text-green-600 font-bold text-xl">
                  {t.price} €
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
