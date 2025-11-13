import { useState, useCallback } from 'react';
import { mlService } from '../services';
import type {
  ForecastRequest,
  ForecastResponse,
  RecommendationRequest,
  RecommendationResponse,
} from '../types/api.types';

export function useForecast() {
  const [forecast, setForecast] = useState<ForecastResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getForecast = useCallback(async (data: ForecastRequest) => {
    try {
      setLoading(true);
      setError(null);
      const response = await mlService.forecast(data);
      setForecast(response);
      return response;
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Erro ao obter previsão');
      console.error('Erro ao obter previsão:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    forecast,
    loading,
    error,
    getForecast,
  };
}

export function useRecommendations() {
  const [recommendations, setRecommendations] = useState<RecommendationResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getRecommendations = useCallback(async (data: RecommendationRequest) => {
    try {
      setLoading(true);
      setError(null);
      const response = await mlService.getRecommendations(data);
      setRecommendations(response);
      return response;
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Erro ao obter recomendações');
      console.error('Erro ao obter recomendações:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    recommendations,
    loading,
    error,
    getRecommendations,
  };
}
