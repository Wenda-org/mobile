import { useMemo } from 'react';
import { MOCK_DESTINATIONS } from '../data/mockDestinations';
import { useAuth } from './useAuth';
import type { TravelPreferences } from '../types/preferences.types';

interface DestinationWithScore {
  destination: typeof MOCK_DESTINATIONS[0];
  score: number;
  reasons: string[];
}

/**
 * Hook para recomendar destinos baseado nas preferências do usuário
 */
export function useRecommendations() {
  const { user } = useAuth();
  const preferences = user?.preferences as TravelPreferences | undefined;

  const recommendedDestinations = useMemo(() => {
    if (!preferences) {
      // Se não tem preferências, retorna destinos em destaque
      return MOCK_DESTINATIONS.filter(d => d.isFeatured).slice(0, 5);
    }

    const scoredDestinations: DestinationWithScore[] = MOCK_DESTINATIONS.map(destination => {
      let score = 0;
      const reasons: string[] = [];

      // 1. Verificar se a categoria está nas favoritas (peso alto)
      if (preferences.favoriteCategories?.includes(destination.category.id)) {
        score += 50;
        reasons.push(`É ${destination.category.name}`);
      }

      // 2. Verificar estilo de viagem
      if (preferences.travelStyle?.includes('nature') && destination.category.slug === 'natureza') {
        score += 30;
        reasons.push('Ideal para amantes da natureza');
      }
      if (preferences.travelStyle?.includes('adventure') && destination.category.slug === 'aventura') {
        score += 30;
        reasons.push('Perfeito para aventureiros');
      }
      if (preferences.travelStyle?.includes('cultural') && 
          (destination.category.slug === 'historia' || destination.category.slug === 'cultural')) {
        score += 30;
        reasons.push('Rico em cultura e história');
      }
      if (preferences.travelStyle?.includes('beach') && destination.category.slug === 'praia') {
        score += 30;
        reasons.push('Praia paradisíaca');
      }
      if (preferences.travelStyle?.includes('relaxation') && 
          (destination.category.slug === 'praia' || destination.category.slug === 'natureza')) {
        score += 20;
        reasons.push('Perfeito para relaxar');
      }
      if (preferences.travelStyle?.includes('urban') && 
          (destination.category.slug === 'cidade' || destination.category.slug === 'urbano')) {
        score += 30;
        reasons.push('Experiência urbana');
      }

      // 3. Verificar nível de atividade
      if (preferences.activityLevel === 'extreme' && destination.category.slug === 'aventura') {
        score += 20;
        reasons.push('Alta intensidade');
      }
      if (preferences.activityLevel === 'low' && 
          (destination.category.slug === 'praia' || destination.category.slug === 'natureza')) {
        score += 15;
        reasons.push('Atividades leves');
      }

      // 4. Verificar companhia de viagem
      if (preferences.travelWith === 'family' && destination.category.slug === 'praia') {
        score += 15;
        reasons.push('Ideal para famílias');
      }
      if (preferences.travelWith === 'couple' && 
          (destination.category.slug === 'praia' || destination.category.slug === 'natureza')) {
        score += 15;
        reasons.push('Romântico');
      }

      // 5. Bonus para destinos em destaque
      if (destination.isFeatured) {
        score += 10;
      }

      // 6. Bonus para alta avaliação
      if (destination.rating >= 4.7) {
        score += 10;
        reasons.push('Muito bem avaliado');
      }

      return {
        destination,
        score,
        reasons,
      };
    });

    // Ordenar por score e retornar os top 10
    return scoredDestinations
      .filter(d => d.score > 0) // Apenas destinos com alguma pontuação
      .sort((a, b) => b.score - a.score)
      .slice(0, 10)
      .map(d => d.destination);
  }, [preferences]);

  const featuredDestinations = useMemo(() => {
    return MOCK_DESTINATIONS.filter(d => d.isFeatured);
  }, []);

  const topRatedDestinations = useMemo(() => {
    return MOCK_DESTINATIONS
      .filter(d => d.rating >= 4.5)
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 10);
  }, []);

  return {
    recommendedDestinations,
    featuredDestinations,
    topRatedDestinations,
    hasPreferences: !!preferences,
  };
}
