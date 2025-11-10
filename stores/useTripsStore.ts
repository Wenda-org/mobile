import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface TripDestination {
  id: string;
  name: string;
  location: string;
  image: string;
  rating: number;
  category?: string;
  coordinate?: {
    latitude: number;
    longitude: number;
  };
  order: number; // Ordem no itinerário
}

export interface Trip {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  destinations: TripDestination[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

interface TripsStore {
  trips: Trip[];
  isLoaded: boolean;
  
  // Actions
  loadTrips: () => Promise<void>;
  addTrip: (trip: Omit<Trip, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateTrip: (id: string, trip: Partial<Trip>) => void;
  deleteTrip: (id: string) => void;
  
  addDestinationToTrip: (tripId: string, destination: Omit<TripDestination, 'order'>) => void;
  removeDestinationFromTrip: (tripId: string, destinationId: string) => void;
  reorderDestinations: (tripId: string, destinations: TripDestination[]) => void;
  
  getTripById: (id: string) => Trip | undefined;
}

export const useTripsStore = create<TripsStore>()(
  persist(
    (set, get) => ({
      trips: [],
      isLoaded: false,

      loadTrips: async () => {
        // Já carregado pelo persist middleware
        set({ isLoaded: true });
      },

      addTrip: (tripData) => {
        const newTrip: Trip = {
          ...tripData,
          id: `trip-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        set((state) => ({
          trips: [newTrip, ...state.trips],
        }));
      },

      updateTrip: (id, tripData) => {
        set((state) => ({
          trips: state.trips.map((trip) =>
            trip.id === id
              ? { ...trip, ...tripData, updatedAt: new Date().toISOString() }
              : trip
          ),
        }));
      },

      deleteTrip: (id) => {
        set((state) => ({
          trips: state.trips.filter((trip) => trip.id !== id),
        }));
      },

      addDestinationToTrip: (tripId, destination) => {
        set((state) => ({
          trips: state.trips.map((trip) => {
            if (trip.id === tripId) {
              const newDestination: TripDestination = {
                ...destination,
                order: trip.destinations.length,
              };
              return {
                ...trip,
                destinations: [...trip.destinations, newDestination],
                updatedAt: new Date().toISOString(),
              };
            }
            return trip;
          }),
        }));
      },

      removeDestinationFromTrip: (tripId, destinationId) => {
        set((state) => ({
          trips: state.trips.map((trip) => {
            if (trip.id === tripId) {
              const newDestinations = trip.destinations
                .filter((dest) => dest.id !== destinationId)
                .map((dest, index) => ({ ...dest, order: index }));
              return {
                ...trip,
                destinations: newDestinations,
                updatedAt: new Date().toISOString(),
              };
            }
            return trip;
          }),
        }));
      },

      reorderDestinations: (tripId, destinations) => {
        set((state) => ({
          trips: state.trips.map((trip) => {
            if (trip.id === tripId) {
              return {
                ...trip,
                destinations: destinations.map((dest, index) => ({
                  ...dest,
                  order: index,
                })),
                updatedAt: new Date().toISOString(),
              };
            }
            return trip;
          }),
        }));
      },

      getTripById: (id) => {
        return get().trips.find((trip) => trip.id === id);
      },
    }),
    {
      name: 'trips-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
