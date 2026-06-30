import { create } from 'zustand';
import { Trip, AddTripDestinationData } from '../types/api.types';
import { tripService } from '../services/tripService';

interface TripsState {
  trips: Trip[];
  currentTrip: Trip | null;
  isLoading: boolean;
  error: string | null;
  fetchTrips: () => Promise<void>;
  fetchTripById: (id: string) => Promise<void>;
  createTrip: (data: { title: string; description?: string; startDate: string; endDate: string }) => Promise<Trip | null>;
  deleteTrip: (id: string) => Promise<boolean>;
  addDestination: (tripId: string, data: AddTripDestinationData) => Promise<boolean>;
  removeDestination: (tripId: string, destId: string) => Promise<boolean>;
}

export const useTripsStore = create<TripsState>((set, get) => ({
  trips: [],
  currentTrip: null,
  isLoading: false,
  error: null,

  fetchTrips: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await tripService.getTrips();
      set({ trips: data });
    } catch (e: any) {
      set({ error: e.message || 'Erro ao carregar viagens' });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchTripById: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const data = await tripService.getTripById(id);
      set({ currentTrip: data });
    } catch (e: any) {
      set({ error: e.message || 'Erro ao carregar detalhes da viagem' });
    } finally {
      set({ isLoading: false });
    }
  },

  createTrip: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const newTrip = await tripService.createTrip(data);
      set((state) => ({ trips: [newTrip, ...state.trips] }));
      return newTrip;
    } catch (e: any) {
      set({ error: e.message || 'Erro ao criar viagem' });
      return null;
    } finally {
      set({ isLoading: false });
    }
  },

  deleteTrip: async (id) => {
    try {
      await tripService.deleteTrip(id);
      set((state) => ({
        trips: state.trips.filter((t) => t.id !== id),
        currentTrip: state.currentTrip?.id === id ? null : state.currentTrip,
      }));
      return true;
    } catch (e) {
      return false;
    }
  },

  addDestination: async (tripId, data) => {
    try {
      await tripService.addDestinationToTrip(tripId, data);
      // Re-fetch details to update UI
      await get().fetchTripById(tripId);
      await get().fetchTrips();
      return true;
    } catch (e) {
      return false;
    }
  },

  removeDestination: async (tripId, destId) => {
    try {
      await tripService.removeDestinationFromTrip(tripId, destId);
      // Re-fetch details to update UI
      await get().fetchTripById(tripId);
      await get().fetchTrips();
      return true;
    } catch (e) {
      return false;
    }
  },
}));
export default useTripsStore;
