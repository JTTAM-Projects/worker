import { useEffect, useRef, useState, useMemo } from 'react';
import { GoogleMap, useJsApiLoader, MarkerClusterer, Marker, Circle } from '@react-google-maps/api';
import { TaskMapInfoWindow } from './TaskMapInfoWindow';
import type { Task, TaskFilters } from '../types';
import { 
  filterMappableTasks, 
  isTaskListCapped,
  DEFAULT_MAP_CENTER,
  calculateZoomFromRadius 
} from '../utils/mapHelpers';

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';

const MAP_CONTAINER_STYLE = {
  width: '100%',
  height: '600px', // Fixed rectangular height
};

const MAP_OPTIONS: google.maps.MapOptions = {
  zoomControl: true,
  fullscreenControl: true,
  streetViewControl: false,
  mapTypeControl: false,
  gestureHandling: 'greedy',
};

const CLUSTERER_OPTIONS = {
  minimumClusterSize: 2, // At least 2 markers to form a cluster
  maxZoom: 14, // Clusters break apart at zoom level 15+ (was 18)
  gridSize: 40, // Smaller grid = only cluster very close markers
  averageCenter: true, // Use average of all markers in cluster for center position
  zoomOnClick: true, // Zoom into cluster when clicked
  enableRetinaIcons: true, // Better quality on high DPI screens
  ignoreHidden: true, // Don't cluster hidden markers
  // Custom calculator to ensure clusters only form for actually overlapping markers
  calculator: (markers: google.maps.Marker[], numStyles: number) => {
    // Only show cluster if there are actually multiple distinct tasks
    const count = markers.length;
    if (count < 2) return { text: '', index: 1 };
    
    // Use a simple index based on count for styling
    let index = 0;
    if (count < 10) index = 1;
    else if (count < 50) index = 2;
    else if (count < 100) index = 3;
    else if (count < 500) index = 4;
    else index = 5;
    
    return {
      text: String(count),
      index: Math.min(index, numStyles),
    };
  },
};

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
  const [selectedTasks, setSelectedTasks] = useState<Task[] | null>(null);

  // Use useMemo to calculate these only when 'tasks' prop changes
  const mappableTasks = useMemo(() => filterMappableTasks(tasks), [tasks]);
  
  // Backend should handle radius filtering, so we use all mappable tasks
  const displayedTasks = mappableTasks;
  
  // Calculate stats with useMemo to avoid redundant filtering
  const stats = useMemo(() => {
    const unmappableTasks = tasks.length - mappableTasks.length;
    return {
      totalTasks: tasks.length,
      mappableTasks: mappableTasks.length,
      unmappableTasks: unmappableTasks,
      hasUnmappableTasks: unmappableTasks > 0,
    };
  }, [tasks, mappableTasks]);
  
  const isCapped = isTaskListCapped(totalElements, tasks.length);

  // Handle map load and fit bounds
  const onMapLoad = (map: google.maps.Map) => {
    mapRef.current = map;
  };

  // Handle marker click - finds all tasks at the same location
  const handleMarkerClick = (clickedTask: Task) => {
    const location = clickedTask.locations[0];
    if (!location) return;

    // Find all tasks at this exact location (stacked markers)
    const tasksAtSameLocation = displayedTasks.filter(task => {
      const loc = task.locations[0];
      return (
        loc &&
        loc.latitude === location.latitude &&
        loc.longitude === location.longitude
      );
    });

    // Set the array of tasks as selected
    setSelectedTasks(tasksAtSameLocation);
  };

  // Fit bounds or center map when tasks or filters change
  useEffect(() => {
    // 1. Get the map instance. If it's not ready, do nothing.
    const map = mapRef.current;
    if (!map) return;

    // 2. If a location filter is active, center on it
    if (filters.latitude && filters.longitude) {
      map.setCenter({ lat: filters.latitude, lng: filters.longitude });
      
      const zoom = filters.radiusKm 
        ? calculateZoomFromRadius(filters.radiusKm) 
        : 12; // Default zoom if no radius
      map.setZoom(zoom);
    } 
    // 3. If no location filter, but we have tasks, fit them all
    else if (displayedTasks.length > 0) {
      const bounds = new google.maps.LatLngBounds();
      
      displayedTasks.forEach((task) => {
        const location = task.locations[0]; 
        if (location && location.latitude && location.longitude) {
          bounds.extend({
            lat: location.latitude,
            lng: location.longitude,
          });
        }
      });

      map.fitBounds(bounds);

      // 4. Prevent over-zooming on a single pin
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
    // 5. If no tasks and no filter, do nothing (map stays on default)
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

  return (
    <div className="bg-white shadow-md overflow-hidden">
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

        <MarkerClusterer options={CLUSTERER_OPTIONS}>
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
                    onClick={() => handleMarkerClick(task)}
                    title={task.title}
                  />
                );
              })}
            </>
          )}
        </MarkerClusterer>

        {/* InfoWindow for selected task(s) */}
        {selectedTasks && selectedTasks.length > 0 && (
          <TaskMapInfoWindow
            tasks={selectedTasks}
            onClose={() => setSelectedTasks(null)}
          />
        )}
      </GoogleMap>
    </div>
  );
}
