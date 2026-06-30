import { useEffect } from 'react';
import { useFavoritesStore } from '../stores/useFavoritesStore';
import { Destination } from '../types/api.types';

export const useFavorites = () => {
  const {
    favorites,
    isLoading,
    error,
    fetchFavorites,
    addFavorite,
    removeFavorite,
    isFavorite,
  } = useFavoritesStore();

  useEffect(() => {
    // Initial fetch on mount if empty
    if (favorites.length === 0 && !isLoading) {
      fetchFavorites().catch(() => {});
    }
  }, []);

  const toggleFavorite = async (destination: Destination): Promise<boolean> => {
    if (isFavorite(destination.id)) {
      return removeFavorite(destination.id);
    } else {
      return addFavorite(destination);
    }
  };

  return {
    favorites,
    isLoading,
    error,
    fetchFavorites,
    addFavorite,
    removeFavorite,
    isFavorite,
    toggleFavorite,
  };
};
export default useFavorites;
