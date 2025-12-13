import { useState, useCallback } from "react";

export interface GeocodingResult {
  latitude: number;
  longitude: number;
}

export interface UseGeocodingReturn {
  geocode: (location: string) => Promise<GeocodingResult | null>;
  isLoading: boolean;
  error: string | null;
}

/**
 * Hook for geocoding location names to coordinates using Nominatim API
 */
export function useGeocoding(): UseGeocodingReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const geocode = useCallback(async (location: string): Promise<GeocodingResult | null> => {
    if (!location.trim()) {
      setError("Location cannot be empty");
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)}&limit=1`,
        {
          headers: {
            "User-Agent": "GligApp/1.0",
          },
        },
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();

      if (data && data.length > 0) {
        const { lat, lon } = data[0];
        return {
          latitude: parseFloat(lat),
          longitude: parseFloat(lon),
        };
      } else {
        setError("Sijaintia ei löytynyt. Kokeile tarkempaa osoitetta.");
        return null;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Virhe haettaessa sijaintia";
      setError(errorMessage);
      console.error("Geocoding error:", err);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { geocode, isLoading, error };
}
