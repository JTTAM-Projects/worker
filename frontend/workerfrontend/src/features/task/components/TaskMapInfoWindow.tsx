import { InfoWindow } from "@react-google-maps/api";
import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import type { Task } from "../types";

interface TaskMapInfoWindowProps {
  tasks: Task[]; // Now accepts an array of tasks
  onClose: () => void;
}

/**
 * InfoWindow component displaying task preview(s) when marker is clicked
 * Handles both single tasks and stacked markers at the same location
 */
export function TaskMapInfoWindow({ tasks, onClose }: TaskMapInfoWindowProps) {
  const navigate = useNavigate();

  // Track which tasks have expanded locations
  const [expandedLocations, setExpandedLocations] = useState<Set<number>>(new Set());

  const toggleLocations = (taskId: number) => {
    setExpandedLocations((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(taskId)) {
        newSet.delete(taskId);
      } else {
        newSet.add(taskId);
      }
      return newSet;
    });
  };

  // All tasks are at the same location, so use the first one for position
  const firstTask = tasks[0];
  const location = firstTask.locations[0];

  return (
    <InfoWindow
      position={{
        lat: location.latitude!,
        lng: location.longitude!,
      }}
      onCloseClick={onClose}
    >
      {/* Scrollable container if multiple tasks */}
      <div className="max-h-96 w-72 max-w-xs overflow-y-auto pr-2">
        {/* Header showing count if multiple tasks */}
        {tasks.length > 1 && (
          <h4 className="mb-3 border-b pb-2 font-bold text-gray-900">{tasks.length} tehtävää tässä sijainnissa</h4>
        )}

        {/* Loop over all tasks at this location */}
        {tasks.map((task, index) => (
          <div key={task.id} className={index > 0 ? "mt-4 border-t pt-4" : ""}>
            {/* Task Title */}
            <h3 className="font-semibold text-gray-900 mb-2 text-base">{task.title}</h3>

            {/* Task Details */}
            <div className="space-y-1 text-sm mb-3">
              {/* Price */}
              <div className="flex items-center gap-1 text-green-600">
                <span className="material-icons text-sm">euro</span>
                <span className="font-medium">{task.price} €</span>
              </div>

              {/* Categories */}
              {task.categories && task.categories.length > 0 && (
                <div className="flex items-center gap-1 text-gray-600">
                  <span className="material-icons text-sm">category</span>
                  <span>{task.categories.map((cat) => cat.title).join(", ")}</span>
                </div>
              )}

              {/* Location(s) - Collapsible if multiple */}
              {task.locations && task.locations.length > 0 && (
                <div className="text-gray-600">
                  <div className="flex items-start gap-1">
                    <span className="material-icons text-sm mt-0.5">location_on</span>
                    <div className="flex-1">
                      {/* First location */}
                      <div>
                        {task.locations[0].streetAddress && <span>{task.locations[0].streetAddress}</span>}
                        {task.locations[0].streetAddress && task.locations[0].city && <span>, </span>}
                        {task.locations[0].city && <span>{task.locations[0].city}</span>}
                      </div>

                      {/* Expand/collapse button if more than 1 location */}
                      {task.locations.length > 1 && (
                        <button
                          onClick={() => toggleLocations(task.id)}
                          className="text-blue-600 hover:text-blue-800 underline text-xs mt-1"
                        >
                          {expandedLocations.has(task.id)
                            ? "Näytä vähemmän"
                            : `+ ${task.locations.length - 1} muuta sijaintia`}
                        </button>
                      )}

                      {/* Additional locations (when expanded) */}
                      {expandedLocations.has(task.id) &&
                        task.locations.slice(1).map((loc, idx) => (
                          <div key={idx} className="mt-1">
                            {loc.streetAddress && <span>{loc.streetAddress}</span>}
                            {loc.streetAddress && loc.city && <span>, </span>}
                            {loc.city && <span>{loc.city}</span>}
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Description Preview */}
            {task.description && <p className="text-gray-700 text-sm mb-3 line-clamp-2">{task.description}</p>}

            {/* View Details Button */}
            <button
              onClick={() => navigate({ to: "/worker/tasks/$taskId", params: { taskId: task.id.toString() } })}
              className="inline-block w-full text-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm font-medium"
            >
              Näytä tiedot
            </button>
          </div>
        ))}
      </div>
    </InfoWindow>
  );
}
