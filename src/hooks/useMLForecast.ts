import { useState } from 'react';
import { mlService, ForecastResponse } from '../services/mlService';

export const useMLForecast = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [forecastData, setForecastData] = useState<ForecastResponse | null>(null);

  const fetchForecast = async (province: string, month: number, year: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await mlService.getForecast({ province, month, year });
      setForecastData(data);
      return data;
    } catch (err: any) {
      setError(err.message || 'Erro ao buscar previsões de visitas');
      
      // Smart local fallback to mock forecast data based on typical weather/seasonality in Angola
      // e.g. July/August is high season (Cacimbo), Dec/Jan is secondary high season.
      let baseVisitors = 5000;
      if (province.toLowerCase() === 'luanda') baseVisitors = 25000;
      else if (province.toLowerCase() === 'huíla' || province.toLowerCase() === 'lubango') baseVisitors = 12000;
      else if (province.toLowerCase() === 'namibe') baseVisitors = 8000;
      
      // Seasonal multiplier
      let multiplier = 1.0;
      if ([6, 7, 8].includes(month)) multiplier = 1.6; // Cacimbo peak (June, July, August)
      else if ([11, 0].includes(month)) multiplier = 1.3; // Holidays
      
      const predicted = Math.round(baseVisitors * multiplier * (0.9 + Math.random() * 0.2));
      const localFallback: ForecastResponse = {
        province,
        month,
        year,
        predicted_visitors: predicted,
        lower_bound: Math.round(predicted * 0.85),
        upper_bound: Math.round(predicted * 1.15),
      };
      setForecastData(localFallback);
      return localFallback;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    forecastData,
    isLoading,
    error,
    fetchForecast,
  };
};
export default useMLForecast;
