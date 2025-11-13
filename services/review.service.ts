import { coreApi } from './api.config';
import type {
  ApiResponse,
  PaginatedResponse,
  Review,
  CreateReviewDto,
  UpdateReviewDto,
} from '../types/api.types';

export const reviewService = {
  /**
   * Listar todas as reviews (com paginação)
   */
  async getReviews(params?: { page?: number; perPage?: number }): Promise<PaginatedResponse<Review>> {
    const response = await coreApi.get<PaginatedResponse<Review>>('/reviews', { params });
    return response.data;
  },

  /**
   * Obter reviews de um destino específico
   */
  async getReviewsByDestination(
    destinationId: string,
    params?: { page?: number; perPage?: number }
  ): Promise<PaginatedResponse<Review>> {
    const response = await coreApi.get<PaginatedResponse<Review>>(
      `/reviews/destination/${destinationId}`,
      { params }
    );
    return response.data;
  },

  /**
   * Criar uma nova review
   */
  async createReview(data: CreateReviewDto): Promise<ApiResponse<Review>> {
    const response = await coreApi.post<ApiResponse<Review>>('/reviews', data);
    return response.data;
  },

  /**
   * Atualizar uma review
   */
  async updateReview(id: string, data: UpdateReviewDto): Promise<ApiResponse<Review>> {
    const response = await coreApi.put<ApiResponse<Review>>(`/reviews/${id}`, data);
    return response.data;
  },

  /**
   * Deletar uma review
   */
  async deleteReview(id: string): Promise<ApiResponse<void>> {
    const response = await coreApi.delete<ApiResponse<void>>(`/reviews/${id}`);
    return response.data;
  },

  /**
   * Marcar review como útil
   */
  async markAsHelpful(id: string): Promise<ApiResponse<{ helpfulCount: number }>> {
    const response = await coreApi.post<ApiResponse<{ helpfulCount: number }>>(
      `/reviews/${id}/helpful`
    );
    return response.data;
  },
};
