import { memo } from "react";

interface LocationSearchInputProps {
  locationSearch: string;
  radiusKm: number;
  isLoading: boolean;
  hasLocation: boolean;
  latitude?: number;
  longitude?: number;
  error?: string | null;
  onLocationSearchChange: (value: string) => void;
  onLocationSearchSubmit: () => void;
  onCurrentLocationClick: () => void;
  onRadiusChange: (value: number) => void;
}

export const LocationSearchInput = memo(function LocationSearchInput({
  locationSearch,
  radiusKm,
  isLoading,
  hasLocation,
  latitude,
  longitude,
  error,
  onLocationSearchChange,
  onLocationSearchSubmit,
  onCurrentLocationClick,
  onRadiusChange,
}: LocationSearchInputProps) {
  return (
    <div className="mb-4">
      <h3 className="text-sm font-medium text-gray-700 mb-3">Sijainti {hasLocation && `(${radiusKm} km säteellä)`}</h3>

      <div className="mt-3 space-y-3">
        <div className="flex space-x-2">
          <input
            type="text"
            value={locationSearch}
            onChange={(e) => onLocationSearchChange(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && onLocationSearchSubmit()}
            onClick={(e) => e.stopPropagation()}
            placeholder="Kaupunki tai osoite..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            disabled={isLoading}
          />
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onCurrentLocationClick();
            }}
            disabled={isLoading}
            className="flex items-center justify-center px-3 py-2 bg-white text-green-600 border-2 border-green-500 rounded-lg hover:bg-green-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="Käytä nykyistä sijaintia"
          >
            <span className="material-icons text-xl">my_location</span>
          </button>
        </div>

        {error && (
          <div className="flex items-center text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">
            <span className="material-icons text-sm mr-2">error</span>
            <span>{error}</span>
          </div>
        )}

        <div>
          <label className="block text-xs text-gray-600 mb-1">Etäisyys: {radiusKm} km</label>
          <input
            type="range"
            min="1"
            max="100"
            value={radiusKm}
            onChange={(e) => onRadiusChange(parseInt(e.target.value))}
            onClick={(e) => e.stopPropagation()}
            className="w-full accent-green-500"
          />
        </div>

        {hasLocation && latitude !== undefined && longitude !== undefined && (
          <div className="flex items-center text-sm text-green-600 bg-green-50 px-3 py-2 rounded-lg">
            <span className="material-icons text-sm mr-2">check_circle</span>
            <span>
              Sijainti asetettu ({latitude.toFixed(4)}, {longitude.toFixed(4)})
            </span>
          </div>
        )}
      </div>
    </div>
  );
});
