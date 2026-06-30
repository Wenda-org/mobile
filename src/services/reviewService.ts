import coreApi from '../api/coreApi';
import { Review } from '../types/api.types';

export interface CreateReviewData {
  destinationId: string;
  rating: number;
  comment: string;
  visitDate?: string;
}

export const reviewService = {
  getReviewsByDestination: async (destinationId: string): Promise<Review[]> => {
    const response = await coreApi.get(`/reviews/destination/${destinationId}`);
    return Array.isArray(response.data) ? response.data : response.data.data || [];
  },

  createReview: async (data: CreateReviewData): Promise<Review> => {
    const response = await coreApi.post('/reviews', data);
    return response.data;
  },
};
