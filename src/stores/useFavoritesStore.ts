import { create } from 'zustand';
import { Destination } from '../types/api.types';
import { favoriteService } from '../services/favoriteService';

interface FavoritesState {
  favorites: Destination[];
  isLoading: boolean;
  error: string | null;
  fetchFavorites: () => Promise<void>;
  addFavorite: (destination: Destination) => Promise<boolean>;
  removeFavorite: (destinationId: string) => Promise<boolean>;
  isFavorite: (destinationId: string) => boolean;
}

export const useFavoritesStore = create<FavoritesState>((set, get) => ({
  favorites: [],
  isLoading: false,
  error: null,

  fetchFavorites: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await favoriteService.getFavorites();
      set({ favorites: data });
    } catch (e: any) {
      set({ error: e.message || 'Erro ao carregar favoritos' });
    } finally {
      set({ isLoading: false });
    }
  },

  addFavorite: async (destination) => {
    // Optimistic UI update
    set((state) => {
      if (state.favorites.some((f) => f.id === destination.id)) return state;
      return { favorites: [...state.favorites, destination] };
    });
    
    try {
      await favoriteService.addFavorite(destination.id);
      return true;
    } catch (e) {
      // Revert on error
      set((state) => ({
        favorites: state.favorites.filter((f) => f.id !== destination.id),
      }));
      return false;
    }
  },

  removeFavorite: async (destinationId) => {
    // Optimistic UI update
    const previousFavorites = get().favorites;
    set((state) => ({
      favorites: state.favorites.filter((f) => f.id !== destinationId),
    }));

    try {
      await favoriteService.removeFavorite(destinationId);
      return true;
    } catch (e) {
      // Revert on error
      set({ favorites: previousFavorites });
      return false;
    }
  },

  isFavorite: (destinationId) => {
    return get().favorites.some((f) => f.id === destinationId);
  },
}));
export default useFavoritesStore;
