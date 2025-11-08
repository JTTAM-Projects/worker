import { InfoWindow } from '@react-google-maps/api';
import { Link } from 'react-router-dom';
import type { Task } from '../types';

interface TaskMapInfoWindowProps {
  tasks: Task[]; // Now accepts an array of tasks
  onClose: () => void;
}

/**
 * InfoWindow component displaying task preview(s) when marker is clicked
 * Handles both single tasks and stacked markers at the same location
 */
export function TaskMapInfoWindow({ tasks, onClose }: TaskMapInfoWindowProps) {
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
          <h4 className="mb-3 border-b pb-2 font-bold text-gray-900">
            {tasks.length} tehtävää tässä sijainnissa
          </h4>
        )}

        {/* Loop over all tasks at this location */}
        {tasks.map((task, index) => (
          <div 
            key={task.id} 
            className={index > 0 ? 'mt-4 border-t pt-4' : ''}
          >
            {/* Task Title */}
            <h3 className="font-semibold text-gray-900 mb-2 text-base">
              {task.title}
            </h3>

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
                  <span>{task.categories.map(cat => cat.title).join(', ')}</span>
                </div>
              )}

              {/* Location */}
              {task.locations[0]?.city && (
                <div className="flex items-center gap-1 text-gray-600">
                  <span className="material-icons text-sm">location_on</span>
                  <span>{task.locations[0].city}</span>
                </div>
              )}
            </div>

            {/* Description Preview */}
            {task.description && (
              <p className="text-gray-700 text-sm mb-3 line-clamp-2">
                {task.description}
              </p>
            )}

            {/* View Details Button */}
            <Link
              to={`/tasks/${task.id}`}
              className="inline-block w-full text-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm font-medium"
            >
              Näytä tiedot
            </Link>
          </div>
        ))}
      </div>
    </InfoWindow>
  );
}
