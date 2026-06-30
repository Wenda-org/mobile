import { create } from 'zustand';
import { User } from '../types/api.types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  setAuth: (user: User, token: string) => Promise<void>;
  setUser: (user: User) => Promise<void>;
  clearAuth: () => Promise<void>;
  initializeAuth: () => Promise<void>;
  setError: (error: string | null) => void;
  setLoading: (isLoading: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isLoading: true,
  error: null,

  setAuth: async (user, token) => {
    try {
      await AsyncStorage.setItem('@wenda_user', JSON.stringify(user));
      // Save in AsyncStorage for interceptor fallback, and SecureStore for secure retrieval
      await AsyncStorage.setItem('@wenda_access_token', token);
      await SecureStore.setItemAsync('wenda_access_token', token);
      set({ user, token, error: null });
    } catch (e) {
      set({ error: 'Erro ao salvar credenciais' });
    }
  },

  setUser: async (user) => {
    try {
      await AsyncStorage.setItem('@wenda_user', JSON.stringify(user));
      set({ user });
    } catch (e) {
      set({ error: 'Erro ao atualizar dados do usuário' });
    }
  },

  clearAuth: async () => {
    try {
      await AsyncStorage.removeItem('@wenda_user');
      await AsyncStorage.removeItem('@wenda_access_token');
      await SecureStore.deleteItemAsync('wenda_access_token');
      set({ user: null, token: null, error: null });
    } catch (e) {
      set({ error: 'Erro ao efetuar logout' });
    }
  },

  initializeAuth: async () => {
    set({ isLoading: true });
    try {
      const userStr = await AsyncStorage.getItem('@wenda_user');
      let token = await SecureStore.getItemAsync('wenda_access_token');
      if (!token) {
        // Fallback to AsyncStorage if SecureStore was cleared
        token = await AsyncStorage.getItem('@wenda_access_token');
      }
      
      if (userStr && token) {
        set({ user: JSON.parse(userStr), token, error: null });
      } else {
        set({ user: null, token: null });
      }
    } catch (e) {
      // Clear potentially corrupted storage
      await AsyncStorage.removeItem('@wenda_user');
      await AsyncStorage.removeItem('@wenda_access_token');
      await SecureStore.deleteItemAsync('wenda_access_token');
      set({ user: null, token: null });
    } finally {
      set({ isLoading: false });
    }
  },

  setError: (error) => set({ error }),
  setLoading: (isLoading) => set({ isLoading }),
}));
export default useAuthStore;
