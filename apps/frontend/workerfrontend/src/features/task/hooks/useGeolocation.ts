import { useState, useCallback } from 'react';

export interface GeolocationResult {
  latitude: number;
  longitude: number;
}

export interface UseGeolocationReturn {
  getCurrentLocation: () => Promise<GeolocationResult | null>;
  isLoading: boolean;
  error: string | null;
}

/**
 * Hook for getting user's current geolocation
 */
export function useGeolocation(): UseGeolocationReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getCurrentLocation = useCallback(async (): Promise<GeolocationResult | null> => {
    if (!navigator.geolocation) {
      setError('Geolokalisaatio ei ole tuettu selaimessasi.');
      return null;
    }

    setIsLoading(true);
    setError(null);

    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setIsLoading(false);
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
        },
        (err) => {
          setIsLoading(false);
          const errorMessage = 'Virhe haettaessa sijaintiasi. Varmista, että olet sallinut sijaintioikeudet.';
          setError(errorMessage);
          console.error('Geolocation error:', err);
          resolve(null);
        }
      );
    });
  }, []);

  return { getCurrentLocation, isLoading, error };
}
