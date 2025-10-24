import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';

export interface FavoriteDestination {
  id: string;
  name: string;
  location: string;
  image?: string;
  rating: number;
  category?: string;
}

interface FavoritesState {
  favorites: FavoriteDestination[];
  isLoaded: boolean;
  addFavorite: (destination: FavoriteDestination) => Promise<void>;
  removeFavorite: (id: string) => Promise<void>;
  isFavorite: (id: string) => boolean;
  loadFavorites: () => Promise<void>;
}

const FAVORITES_KEY = 'wenda_favorites';

export const useFavoritesStore = create<FavoritesState>((set, get) => ({
  favorites: [],
  isLoaded: false,

  loadFavorites: async () => {
    try {
      const stored = await SecureStore.getItemAsync(FAVORITES_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        set({ favorites: parsed, isLoaded: true });
      } else {
        set({ isLoaded: true });
      }
    } catch (error) {
      console.error('Error loading favorites:', error);
      set({ isLoaded: true });
    }
  },

  addFavorite: async (destination: FavoriteDestination) => {
    const { favorites } = get();
    const exists = favorites.some((f) => f.id === destination.id);
    
    if (!exists) {
      const updated = [...favorites, destination];
      set({ favorites: updated });
      
      try {
        await SecureStore.setItemAsync(FAVORITES_KEY, JSON.stringify(updated));
      } catch (error) {
        console.error('Error saving favorite:', error);
      }
    }
  },

  removeFavorite: async (id: string) => {
    const { favorites } = get();
    const updated = favorites.filter((f) => f.id !== id);
    set({ favorites: updated });
    
    try {
      await SecureStore.setItemAsync(FAVORITES_KEY, JSON.stringify(updated));
    } catch (error) {
      console.error('Error removing favorite:', error);
    }
  },

  isFavorite: (id: string) => {
    const { favorites } = get();
    return favorites.some((f) => f.id === id);
  },
}));
