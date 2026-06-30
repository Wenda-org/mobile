import { useQuery } from '@tanstack/react-query';
import { mlService } from '../services/mlService';
import { useAuth } from './useAuth';
import { useDestinations } from './useDestinations';
import { Destination } from '../types/api.types';

export const useRecommendations = (topN = 5) => {
  const { user } = useAuth();
  const { destinations } = useDestinations();

  const userPrefs = user?.preferences || {};
  const preferredCategories = userPrefs.preferred_categories || [];
  const preferredProvinces = userPrefs.preferred_provinces || [];

  // Query ML service for recommendations
  const mlQuery = useQuery({
    queryKey: ['ml-recommendations', user?.id, preferredCategories, preferredProvinces, topN],
    queryFn: async () => {
      const res = await mlService.getRecommendations({
        user_preferences: {
          preferred_categories: preferredCategories,
          preferred_provinces: preferredProvinces,
        },
        top_n: topN,
      });
      return res.recommendations;
    },
    enabled: !!user && (preferredCategories.length > 0 || preferredProvinces.length > 0),
    retry: 1,
    staleTime: 1000 * 60 * 15, // 15 mins cache
  });

  // Calculate local recommendations as fallback (high quality algorithm)
  const getLocalRecommendations = (): Destination[] => {
    if (!destinations || destinations.length === 0) return [];
    
    // Score destinations based on user preferences
    const scored = destinations.map(dest => {
      let score = 0;
      
      // Category match
      if (preferredCategories.includes(dest.categoryId) || preferredCategories.includes(dest.category?.name)) {
        score += 5;
      }
      
      // Province match
      if (preferredProvinces.includes(dest.province)) {
        score += 3;
      }
      
      // Rating boost
      score += dest.rating * 0.5;
      
      // Feature boost
      if (dest.isFeatured) {
        score += 1;
      }
      
      return { destination: dest, score };
    });

    // Sort by score descending and return topN destinations
    return scored
      .sort((a, b) => b.score - a.score)
      .slice(0, topN)
      .map(item => item.destination);
  };

  // Hydrate ML recommendation IDs with full destination data
  const getHydratedRecommendations = (): Destination[] => {
    if (mlQuery.data && mlQuery.data.length > 0 && destinations.length > 0) {
      const mlDests = mlQuery.data
        .map(rec => destinations.find(d => d.id === rec.destination_id))
        .filter((d): d is Destination => !!d);
        
      if (mlDests.length > 0) return mlDests;
    }
    
    // Fallback to local filtering
    return getLocalRecommendations();
  };

  return {
    recommendations: getHydratedRecommendations(),
    isLoading: mlQuery.isLoading && destinations.length === 0,
    isError: mlQuery.isError,
    refetch: mlQuery.refetch,
    isFallback: !mlQuery.data || mlQuery.data.length === 0,
  };
};
export default useRecommendations;
