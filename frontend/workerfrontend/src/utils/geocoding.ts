/**
 * Geocoding utility to convert addresses to coordinates using Google Maps Geocoding API
 */

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

export interface GeocodeResult {
  latitude: number;
  longitude: number;
  formattedAddress?: string;
}

/**
 * Geocode an address to get latitude and longitude coordinates
 * @param address Full address string or address components
 * @returns Promise with latitude and longitude, or null if geocoding fails
 */
export async function geocodeAddress(
  address:
    | string
    | {
        streetAddress?: string;
        postalCode?: string;
        city: string;
        country: string;
      },
): Promise<GeocodeResult | null> {
  if (!GOOGLE_MAPS_API_KEY) {
    console.warn("Google Maps API key not configured");
    return null;
  }

  try {
    // Build address string from components if object is passed
    const addressString =
      typeof address === "string"
        ? address
        : [address.streetAddress, address.postalCode, address.city, address.country].filter(Boolean).join(", ");

    const url = new URL("https://maps.googleapis.com/maps/api/geocode/json");
    url.searchParams.set("address", addressString);
    url.searchParams.set("key", GOOGLE_MAPS_API_KEY);

    const response = await fetch(url.toString());

    if (!response.ok) {
      console.error("Geocoding API request failed:", response.status);
      return null;
    }

    const data = await response.json();

    if (data.status !== "OK" || !data.results || data.results.length === 0) {
      console.warn("Geocoding failed:", data.status, data.error_message);
      return null;
    }

    const result = data.results[0];
    const location = result.geometry?.location;

    if (!location || typeof location.lat !== "number" || typeof location.lng !== "number") {
      console.error("Invalid location data in geocoding response");
      return null;
    }

    return {
      latitude: location.lat,
      longitude: location.lng,
      formattedAddress: result.formatted_address,
    };
  } catch (error) {
    console.error("Geocoding error:", error);
    return null;
  }
}

/**
 * Reverse geocode coordinates to get address information
 * @param latitude Latitude coordinate
 * @param longitude Longitude coordinate
 * @returns Promise with address information, or null if reverse geocoding fails
 */
export async function reverseGeocode(
  latitude: number,
  longitude: number,
): Promise<{ formattedAddress: string } | null> {
  if (!GOOGLE_MAPS_API_KEY) {
    console.warn("Google Maps API key not configured");
    return null;
  }

  try {
    const url = new URL("https://maps.googleapis.com/maps/api/geocode/json");
    url.searchParams.set("latlng", `${latitude},${longitude}`);
    url.searchParams.set("key", GOOGLE_MAPS_API_KEY);

    const response = await fetch(url.toString());

    if (!response.ok) {
      console.error("Reverse geocoding API request failed:", response.status);
      return null;
    }

    const data = await response.json();

    if (data.status !== "OK" || !data.results || data.results.length === 0) {
      console.warn("Reverse geocoding failed:", data.status);
      return null;
    }

    return {
      formattedAddress: data.results[0].formatted_address,
    };
  } catch (error) {
    console.error("Reverse geocoding error:", error);
    return null;
  }
}
