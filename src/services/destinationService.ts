import coreApi from '../api/coreApi';
import { Destination, Category } from '../types/api.types';

export interface GetDestinationsParams {
  page?: number;
  perPage?: number;
  search?: string;
  categoryId?: string;
  province?: string;
  sortBy?: string;
}

export const destinationService = {
  getDestinations: async (params?: GetDestinationsParams): Promise<Destination[]> => {
    const response = await coreApi.get('/destinations', { params });
    // Core response structure might contain paging, but we fallback to returning array directly if array or data field
    return Array.isArray(response.data) ? response.data : response.data.data || [];
  },

  getDestinationById: async (id: string): Promise<Destination> => {
    const response = await coreApi.get(`/destinations/${id}`);
    return response.data;
  },

  getCategories: async (): Promise<Category[]> => {
    const response = await coreApi.get('/categories');
    return Array.isArray(response.data) ? response.data : response.data.data || [];
  },
};
