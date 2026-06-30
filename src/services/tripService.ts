import coreApi from '../api/coreApi';
import { Trip } from '../types/api.types';

export interface CreateTripData {
  title: string;
  description?: string;
  startDate: string;
  endDate: string;
}

export interface AddTripDestinationData {
  destinationId: string;
  visitDate?: string;
  notes?: string;
}

export const tripService = {
  getTrips: async (): Promise<Trip[]> => {
    const response = await coreApi.get('/trips');
    return Array.isArray(response.data) ? response.data : response.data.data || [];
  },

  getTripById: async (id: string): Promise<Trip> => {
    const response = await coreApi.get(`/trips/${id}`);
    return response.data;
  },

  createTrip: async (data: CreateTripData): Promise<Trip> => {
    const response = await coreApi.post('/trips', data);
    return response.data;
  },

  deleteTrip: async (id: string): Promise<any> => {
    const response = await coreApi.delete(`/trips/${id}`);
    return response.data;
  },

  addDestinationToTrip: async (tripId: string, data: AddTripDestinationData): Promise<any> => {
    const response = await coreApi.post(`/trips/${tripId}/destinations`, data);
    return response.data;
  },

  removeDestinationFromTrip: async (tripId: string, destId: string): Promise<any> => {
    const response = await coreApi.delete(`/trips/${tripId}/destinations/${destId}`);
    return response.data;
  },
};
