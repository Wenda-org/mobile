import { coreApi } from './api.config';
import type {
  ApiResponse,
  Favorite,
  CreateFavoriteDto,
} from '../types/api.types';

export const favoriteService = {
  /**
   * Listar todos os favoritos do usuário
   */
  async getFavorites(): Promise<ApiResponse<Favorite[]>> {
    const response = await coreApi.get<ApiResponse<Favorite[]>>('/favorites');
    return response.data;
  },

  /**
   * Adicionar destino aos favoritos
   */
  async addFavorite(data: CreateFavoriteDto): Promise<ApiResponse<Favorite>> {
    const response = await coreApi.post<ApiResponse<Favorite>>('/favorites', data);
    return response.data;
  },

  /**
   * Remover destino dos favoritos
   */
  async removeFavorite(id: string): Promise<ApiResponse<void>> {
    const response = await coreApi.delete<ApiResponse<void>>(`/favorites/${id}`);
    return response.data;
  },

  /**
   * Verificar se um destino está nos favoritos
   */
  async checkFavorite(destinationId: string): Promise<ApiResponse<{ isFavorite: boolean; favoriteId?: string }>> {
    const response = await coreApi.get<ApiResponse<{ isFavorite: boolean; favoriteId?: string }>>(
      `/favorites/check/${destinationId}`
    );
    return response.data;
  },
};
