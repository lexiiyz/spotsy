export interface UserCoordinates {
  latitude: number;
  longitude: number;
  accuracy?: number;
}

export const DEFAULT_SURABAYA_COORDS: UserCoordinates = {
  latitude: -7.2754,
  longitude: 112.7912,
};

export function getCurrentUserLocation(): Promise<UserCoordinates> {
  return new Promise((resolve) => {
    if (typeof window === "undefined" || !("geolocation" in navigator)) {
      resolve(DEFAULT_SURABAYA_COORDS);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
        });
      },
      (error) => {
        console.warn("Geolocation permission denied or failed:", error.message);
        resolve(DEFAULT_SURABAYA_COORDS);
      },
      {
        enableHighAccuracy: true,
        timeout: 8000,
        maximumAge: 60000,
      }
    );
  });
}
