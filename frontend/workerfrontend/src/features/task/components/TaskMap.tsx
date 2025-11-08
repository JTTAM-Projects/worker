import { useEffect, useRef, useState } from 'react';
import { GoogleMap, useJsApiLoader, MarkerClusterer, Marker, Circle } from '@react-google-maps/api';
import { TaskMapInfoWindow } from './TaskMapInfoWindow';
import type { Task, TaskFilters } from '../types';
import { 
  filterMappableTasks, 
  getMappingStats, 
  isTaskListCapped,
  DEFAULT_MAP_CENTER,
  calculateZoomFromRadius 
} from '../utils/mapHelpers';

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';

const MAP_CONTAINER_STYLE = {
  width: '100%',
  height: '600px',
};

const MAP_OPTIONS: google.maps.MapOptions = {
  zoomControl: true,
  fullscreenControl: true,
  streetViewControl: false,
  mapTypeControl: false,
  gestureHandling: 'greedy',
};

/**
 * Filter tasks by distance from center point
 * Uses Haversine formula for accurate distance calculation
 */
function filterTasksByRadius(
  tasks: Task[],
  centerLat: number,
  centerLng: number,
  radiusKm: number
): Task[] {
  return tasks.filter((task) => {
    const location = task.locations[0];
    if (!location || !location.latitude || !location.longitude) return false;

    const R = 6371; // Earth's radius in km
    const dLat = toRad(location.latitude - centerLat);
    const dLon = toRad(location.longitude - centerLng);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(centerLat)) *
        Math.cos(toRad(location.latitude)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;

    return distance <= radiusKm;
  });
}

function toRad(degrees: number): number {
  return degrees * (Math.PI / 180);
}

interface TaskMapProps {
  tasks: Task[];
  totalElements: number;
  filters: TaskFilters;
  isLoading?: boolean;
}

export function TaskMap({ tasks, totalElements, filters, isLoading }: TaskMapProps) {
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    libraries: ['marker'],
  });

  const mapRef = useRef<google.maps.Map | null>(null);
  const hasInitialized = useRef(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  // Filter tasks with valid coordinates
  const mappableTasks = filterMappableTasks(tasks);
  
  // Filter by radius if location filter is active
  const displayedTasks = (filters.latitude && filters.longitude && filters.radiusKm)
    ? filterTasksByRadius(mappableTasks, filters.latitude, filters.longitude, filters.radiusKm)
    : mappableTasks;
  
  const stats = getMappingStats(tasks);
  const isCapped = isTaskListCapped(totalElements, tasks.length);

  // Handle map load and fit bounds
  const onMapLoad = (map: google.maps.Map) => {
    mapRef.current = map;
  };

  // Fit bounds or center map when tasks change - only on first load
  useEffect(() => {
    if (!mapRef.current || displayedTasks.length === 0 || hasInitialized.current) return;

    const map = mapRef.current;
    hasInitialized.current = true;

    // If location filter is active, center on that location
    if (filters.latitude && filters.longitude) {
      map.setCenter({ lat: filters.latitude, lng: filters.longitude });
      
      // Calculate zoom based on radius
      const zoom = filters.radiusKm 
        ? calculateZoomFromRadius(filters.radiusKm) 
        : 12;
      map.setZoom(zoom);
    } else {
      // Fit bounds to show all markers
      const bounds = new google.maps.LatLngBounds();
      
      displayedTasks.forEach((task) => {
        const location = task.locations[0]; // Use first location
        if (location && location.latitude && location.longitude) {
          bounds.extend({
            lat: location.latitude,
            lng: location.longitude,
          });
        }
      });

      map.fitBounds(bounds);

      // Prevent excessive zoom on single marker
      const listener = google.maps.event.addListenerOnce(map, 'bounds_changed', () => {
        const currentZoom = map.getZoom();
        if (currentZoom && currentZoom > 15) {
          map.setZoom(15);
        }
      });

      return () => {
        google.maps.event.removeListener(listener);
      };
    }
  }, [displayedTasks, filters.latitude, filters.longitude, filters.radiusKm]);

  // Loading state
  if (!isLoaded || isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
        <div className="flex items-center justify-center" style={{ height: '600px' }}>
          <div className="text-center text-gray-600">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mb-4"></div>
            <p className="text-lg font-semibold">Ladataan karttaa...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (loadError) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
        <div className="text-center text-red-600 py-12">
          <span className="material-icons text-6xl mb-4">error_outline</span>
          <p className="text-xl font-semibold mb-2">Kartan lataus epäonnistui</p>
          <p className="text-sm">Tarkista verkkoyhteytesi ja yritä uudelleen.</p>
        </div>
      </div>
    );
  }

  // Empty state - no tasks
  if (tasks.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
        <div className="text-center text-gray-600 py-12">
          <span className="material-icons text-gray-400 text-6xl mb-4">location_off</span>
          <p className="text-xl font-semibold mb-2">Ei tehtäviä kartalla</p>
          <p>Yhtään tehtävää ei löytynyt valituilla suodattimilla.</p>
        </div>
      </div>
    );
  }

  // Empty state - no mappable tasks
  if (mappableTasks.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
        <div className="text-center text-gray-600 py-12">
          <span className="material-icons text-gray-400 text-6xl mb-4">location_off</span>
          <p className="text-xl font-semibold mb-2">Ei sijaintitietoja</p>
          <p>Löydettyihin tehtäviin ({tasks.length} kpl) ei ole määritelty sijaintitietoja.</p>
        </div>
      </div>
    );
  }

  // Empty state - no tasks in radius
  if (displayedTasks.length === 0 && filters.latitude && filters.longitude) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
        <div className="text-center text-gray-600 py-12">
          <span className="material-icons text-gray-400 text-6xl mb-4">near_me_disabled</span>
          <p className="text-xl font-semibold mb-2">Ei tehtäviä alueella</p>
          <p>Yhtään tehtävää ei löytynyt {filters.radiusKm} km säteellä sijainnista "{filters.locationText || 'valittu sijainti'}".</p>
          <p className="mt-2 text-sm">Kokeile suurentaa hakusädettä tai valitse toinen sijainti.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Info bar */}
      <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2 text-sm text-gray-700">
          <span className="material-icons text-green-600 text-lg">location_on</span>
          <span>
            Näytetään <strong>{displayedTasks.length}</strong> tehtävää kartalla
            {filters.latitude && filters.longitude && filters.radiusKm && (
              <span className="text-gray-600 ml-2">
                ({filters.radiusKm} km säteellä: {filters.locationText || 'valittu sijainti'})
              </span>
            )}
            {stats.hasUnmappableTasks && (
              <span className="text-gray-500 ml-2">
                ({stats.unmappableTasks} ilman sijaintia)
              </span>
            )}
          </span>
        </div>
        
        {isCapped && (
          <div className="flex items-center gap-2 text-sm text-amber-700 bg-amber-50 px-3 py-1 rounded">
            <span className="material-icons text-lg">info</span>
            <span>Näytetään ensimmäiset 1000 tehtävää. Rajaa hakua suodattimilla.</span>
          </div>
        )}
      </div>

      {/* Map */}
      <GoogleMap
        mapContainerStyle={MAP_CONTAINER_STYLE}
        center={DEFAULT_MAP_CENTER}
        zoom={12}
        onLoad={onMapLoad}
        options={MAP_OPTIONS}
      >
        {/* Location filter circle overlay */}
        {filters.latitude && filters.longitude && filters.radiusKm && (
          <Circle
            center={{
              lat: filters.latitude,
              lng: filters.longitude,
            }}
            radius={filters.radiusKm * 1000} // Convert km to meters
            options={{
              fillColor: '#10b981',
              fillOpacity: 0.1,
              strokeColor: '#10b981',
              strokeOpacity: 0.5,
              strokeWeight: 2,
            }}
          />
        )}

        <MarkerClusterer>
          {(clusterer) => (
            <>
              {displayedTasks.map((task) => {
                const location = task.locations[0]; // Use first location for marker
                return (
                  <Marker
                    key={task.id}
                    position={{
                      lat: location.latitude!,
                      lng: location.longitude!,
                    }}
                    clusterer={clusterer}
                    onClick={() => setSelectedTask(task)}
                    title={task.title}
                  />
                );
              })}
            </>
          )}
        </MarkerClusterer>

        {/* InfoWindow for selected task */}
        {selectedTask && (
          <TaskMapInfoWindow
            task={selectedTask}
            onClose={() => setSelectedTask(null)}
          />
        )}
      </GoogleMap>
    </div>
  );
}
