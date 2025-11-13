import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useRouter, useSegments } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { User } from '../types/api.types';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext deve ser usado dentro de AuthProvider');
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const segments = useSegments();
  const router = useRouter();

  // Carregar usuário do AsyncStorage na inicialização
  useEffect(() => {
    loadUser();
  }, []);

  // Proteção de rotas
  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === '(auth)';
    const publicRoutes = ['language', ''];
    const isPublicRoute = publicRoutes.includes(segments[0] as string);
    
    if (!user && !inAuthGroup && !isPublicRoute) {
      // Usuário não autenticado tentando acessar rota protegida
      router.replace('/(auth)/login');
    } else if (user && inAuthGroup) {
      // Usuário autenticado tentando acessar tela de auth
      router.replace('/(tabs)');
    }
  }, [user, segments, isLoading]);

  const loadUser = async () => {
    try {
      const [userData, token] = await Promise.all([
        AsyncStorage.getItem('@wenda_user'),
        AsyncStorage.getItem('@wenda_access_token'),
      ]);

      if (userData && token) {
        setUser(JSON.parse(userData));
      }
    } catch (error) {
      console.error('Erro ao carregar usuário:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    try {
      await AsyncStorage.multiRemove(['@wenda_user', '@wenda_access_token']);
      setUser(null);
      router.replace('/language');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    setUser,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
