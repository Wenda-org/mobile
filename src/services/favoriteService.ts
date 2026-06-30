import coreApi from '../api/coreApi';
import { Destination } from '../types/api.types';

export const favoriteService = {
  getFavorites: async (): Promise<Destination[]> => {
    const response = await coreApi.get('/favorites');
    return Array.isArray(response.data) ? response.data : response.data.data || [];
  },

  addFavorite: async (destinationId: string): Promise<any> => {
    const response = await coreApi.post('/favorites', { destinationId });
    return response.data;
  },

  removeFavorite: async (favoriteId: string): Promise<any> => {
    const response = await coreApi.delete(`/favorites/${favoriteId}`);
    return response.data;
  },
};
