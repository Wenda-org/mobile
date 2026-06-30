import { useState, useEffect } from 'react';
import * as Location from 'expo-location';

export interface LocationCoords {
  latitude: number;
  longitude: number;
}

// Default to Luanda, Angola center coordinates
export const DEFAULT_COORDS: LocationCoords = {
  latitude: -8.83682,
  longitude: 13.23308,
};

export const useLocation = () => {
  const [location, setLocation] = useState<LocationCoords | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    let subscription: Location.LocationSubscription | null = null;

    const requestLocation = async () => {
      setIsLoading(true);
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setErrorMsg('Permission to access location was denied');
          setLocation(DEFAULT_COORDS);
          return;
        }

        const currentLoc = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });
        setLocation({
          latitude: currentLoc.coords.latitude,
          longitude: currentLoc.coords.longitude,
        });

        // Watch location updates
        subscription = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.Balanced,
            timeInterval: 10000, // 10 seconds
            distanceInterval: 20, // 20 meters
          },
          (newLocation) => {
            setLocation({
              latitude: newLocation.coords.latitude,
              longitude: newLocation.coords.longitude,
            });
          }
        );
      } catch (error: any) {
        setErrorMsg(error.message || 'Error fetching location');
        setLocation(DEFAULT_COORDS);
      } finally {
        setIsLoading(false);
      }
    };

    requestLocation();

    return () => {
      if (subscription) {
        subscription.remove();
      }
    };
  }, []);

  return {
    location: location || DEFAULT_COORDS,
    errorMsg,
    isLoading,
    isPermissionGranted: errorMsg === null,
  };
};
export default useLocation;
