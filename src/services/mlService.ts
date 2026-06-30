import mlApi from '../api/mlApi';
import { Destination } from '../types/api.types';

export interface ForecastParams {
  province: string;
  month: number;
  year: number;
}

export interface ForecastResponse {
  province: string;
  month: number;
  year: number;
  predicted_visitors: number;
  lower_bound: number;
  upper_bound: number;
}

export interface RecommendationParams {
  user_preferences: {
    preferred_categories: string[];
    preferred_provinces: string[];
  };
  top_n?: number;
}

export interface RecommendationResponse {
  recommendations: Array<{
    destination_id: string;
    name: string;
    similarity_score: number;
    destination_details?: Destination; // Hydrated in UI if needed
  }>;
}

export interface SegmentResponse {
  userId: string;
  segment: 'cultural' | 'adventure' | 'ecological' | 'gastronomic' | 'beach' | 'unknown';
  confidence: number;
}

export const mlService = {
  health: async (): Promise<boolean> => {
    try {
      const response = await mlApi.get('/health');
      return response.status === 200;
    } catch {
      return false;
    }
  },

  getModels: async (): Promise<any> => {
    const response = await mlApi.get('/models');
    return response.data;
  },

  getForecast: async (params: ForecastParams): Promise<ForecastResponse> => {
    const response = await mlApi.post('/forecast', params);
    return response.data;
  },

  getRecommendations: async (params: RecommendationParams): Promise<RecommendationResponse> => {
    const response = await mlApi.post('/recommend', params);
    return response.data;
  },

  getUserSegment: async (userId: string): Promise<SegmentResponse> => {
    const response = await mlApi.get(`/segments/${userId}`);
    return response.data;
  },
};
