import { useState, useCallback } from 'react';
import { favoriteService } from '../services';
import type { Favorite } from '../types/api.types';

export function useFavorites() {
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchFavorites = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await favoriteService.getFavorites();
      if (response.success && response.data) {
        setFavorites(response.data);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao carregar favoritos');
      console.error('Erro ao carregar favoritos:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const addFavorite = useCallback(async (destinationId: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await favoriteService.addFavorite({ destinationId });
      if (response.success && response.data) {
        setFavorites((prev) => [...prev, response.data!]);
        return true;
      }
      return false;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao adicionar favorito');
      console.error('Erro ao adicionar favorito:', err);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const removeFavorite = useCallback(async (favoriteId: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await favoriteService.removeFavorite(favoriteId);
      if (response.success) {
        setFavorites((prev) => prev.filter((f) => f.id !== favoriteId));
        return true;
      }
      return false;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao remover favorito');
      console.error('Erro ao remover favorito:', err);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const checkFavorite = useCallback(async (destinationId: string) => {
    try {
      const response = await favoriteService.checkFavorite(destinationId);
      if (response.success && response.data) {
        return response.data;
      }
      return { isFavorite: false };
    } catch (err: any) {
      console.error('Erro ao verificar favorito:', err);
      return { isFavorite: false };
    }
  }, []);

  return {
    favorites,
    loading,
    error,
    fetchFavorites,
    addFavorite,
    removeFavorite,
    checkFavorite,
  };
}
