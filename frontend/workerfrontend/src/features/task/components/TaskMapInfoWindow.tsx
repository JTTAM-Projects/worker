import { InfoWindow } from '@react-google-maps/api';
import { Link } from 'react-router-dom';
import type { Task } from '../types';

interface TaskMapInfoWindowProps {
  task: Task;
  onClose: () => void;
}

/**
 * InfoWindow component displaying task preview when marker is clicked
 */
export function TaskMapInfoWindow({ task, onClose }: TaskMapInfoWindowProps) {
  return (
    <InfoWindow
      position={{
        lat: task.location.latitude!,
        lng: task.location.longitude!,
      }}
      onCloseClick={onClose}
    >
      <div className="p-2 max-w-xs">
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
          {task.location.city && (
            <div className="flex items-center gap-1 text-gray-600">
              <span className="material-icons text-sm">location_on</span>
              <span>{task.location.city}</span>
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
    </InfoWindow>
  );
}
