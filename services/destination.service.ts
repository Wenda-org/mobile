import { coreApi } from './api.config';
import type {
  ApiResponse,
  PaginatedResponse,
  Destination,
  DestinationSummary,
  DestinationFilters,
} from '../types/api.types';

export const destinationService = {
  /**
   * Listar destinos com filtros e paginação
   */
  async getDestinations(
    filters?: DestinationFilters
  ): Promise<PaginatedResponse<DestinationSummary>> {
    const response = await coreApi.get<PaginatedResponse<DestinationSummary>>(
      '/destinations',
      { params: filters }
    );
    return response.data;
  },

  /**
   * Obter detalhes de um destino específico
   */
  async getDestinationById(id: string): Promise<ApiResponse<Destination>> {
    const response = await coreApi.get<ApiResponse<Destination>>(`/destinations/${id}`);
    return response.data;
  },

  /**
   * Obter destino por slug
   */
  async getDestinationBySlug(slug: string): Promise<ApiResponse<Destination>> {
    const response = await coreApi.get<ApiResponse<Destination>>(`/destinations/slug/${slug}`);
    return response.data;
  },
};
