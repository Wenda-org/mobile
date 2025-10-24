import { useState, useEffect } from 'react';
import * as Location from 'expo-location';

interface LocationState {
  location: Location.LocationObject | null;
  error: string | null;
  loading: boolean;
  hasPermission: boolean | null;
}

export function useLocation() {
  const [state, setState] = useState<LocationState>({
    location: null,
    error: null,
    loading: true,
    hasPermission: null,
  });

  useEffect(() => {
    let mounted = true;
    
    async function getLocation() {
      try {
        // Request permission
        const { status } = await Location.requestForegroundPermissionsAsync();
        
        if (!mounted) return;
        
        if (status !== 'granted') {
          setState({
            location: null,
            error: 'Permission to access location was denied',
            loading: false,
            hasPermission: false,
          });
          return;
        }

        // Get current location
        const location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });

        if (mounted) {
          setState({
            location,
            error: null,
            loading: false,
            hasPermission: true,
          });
        }
      } catch (err) {
        if (mounted) {
          setState({
            location: null,
            error: err instanceof Error ? err.message : 'Failed to get location',
            loading: false,
            hasPermission: false,
          });
        }
      }
    }

    getLocation();
    
    return () => {
      mounted = false;
    };
  }, []);

  return state;
}

// Calculate distance between two coordinates in kilometers using Haversine formula
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  
  return distance;
}

function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}
