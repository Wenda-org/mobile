import { mlApi } from './api.config';
import type {
  ForecastRequest,
  ForecastResponse,
  RecommendationRequest,
  RecommendationResponse,
  SegmentationResponse,
  MLHealthResponse,
  MLModelsResponse,
} from '../types/api.types';

export const mlService = {
  /**
   * Health check do serviço ML
   */
  async healthCheck(): Promise<MLHealthResponse> {
    const response = await mlApi.get<MLHealthResponse>('/health');
    return response.data;
  },

  /**
   * Listar todos os modelos ML disponíveis
   */
  async getModels(): Promise<MLModelsResponse> {
    const response = await mlApi.get<MLModelsResponse>('/models');
    return response.data;
  },

  /**
   * Prever número de visitantes para uma província em determinado mês/ano
   */
  async forecast(data: ForecastRequest): Promise<ForecastResponse> {
    const response = await mlApi.post<ForecastResponse>('/forecast', data);
    return response.data;
  },

  /**
   * Obter recomendações personalizadas de destinos
   */
  async getRecommendations(data: RecommendationRequest): Promise<RecommendationResponse> {
    const response = await mlApi.post<RecommendationResponse>('/recommend', data);
    return response.data;
  },

  /**
   * Obter segmentação/perfil do usuário
   */
  async getSegmentation(userId: string): Promise<SegmentationResponse> {
    const response = await mlApi.get<SegmentationResponse>(`/segments/${userId}`);
    return response.data;
  },
};
