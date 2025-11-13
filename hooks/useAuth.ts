import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState, useEffect } from 'react';
import { authService } from '../services';
import type { User } from '../types/api.types';
import { useAuthContext } from '../contexts/AuthContext';

// This hook manages authentication state
export function useAuth() {
  const { user: contextUser, setUser: setContextUser } = useAuthContext();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await authService.login({ email, password });

      if (response.success && response.data) {
        // Salvar token e usuário
        await AsyncStorage.setItem('@wenda_access_token', response.data.accessToken);
        await AsyncStorage.setItem('@wenda_user', JSON.stringify(response.data.user));
        
        setContextUser(response.data.user);
        
        return { 
          success: true, 
          user: response.data.user 
        };
      } else {
        const errorMessage = response.message || 'Erro ao fazer login';
        setError(errorMessage);
        return { 
          success: false, 
          error: errorMessage 
        };
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Erro ao fazer login';
      setError(errorMessage);
      console.error('Login error:', error);
      return { 
        success: false, 
        error: errorMessage 
      };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (
    name: string, 
    email: string, 
    password: string, 
    confirmPassword: string,
    phone?: string,
    avatarUrl?: string
  ) => {
    try {
      setIsLoading(true);
      setError(null);

      // Validação básica
      if (password !== confirmPassword) {
        const errorMessage = 'As senhas não coincidem';
        setError(errorMessage);
        return { 
          success: false, 
          error: errorMessage 
        };
      }

      if (password.length < 6) {
        const errorMessage = 'A senha deve ter no mínimo 6 caracteres';
        setError(errorMessage);
        return { 
          success: false, 
          error: errorMessage 
        };
      }

      const response = await authService.register({ 
        name, 
        email, 
        password, 
        confirmPassword,
        phone,
        avatarUrl
      });

      if (response.success && response.data) {
        // Salvar token e usuário
        await AsyncStorage.setItem('@wenda_access_token', response.data.accessToken);
        await AsyncStorage.setItem('@wenda_user', JSON.stringify(response.data.user));
        
        setContextUser(response.data.user);
        
        return { 
          success: true, 
          user: response.data.user 
        };
      } else {
        const errorMessage = response.message || 'Erro ao criar conta';
        setError(errorMessage);
        return { 
          success: false, 
          error: errorMessage 
        };
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Erro ao criar conta';
      setError(errorMessage);
      console.error('Register error:', error);
      return { 
        success: false, 
        error: errorMessage 
      };
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (data: { 
    name?: string; 
    phone?: string; 
    avatarUrl?: string;
    preferences?: Record<string, any>;
  }) => {
    try {
      setIsLoading(true);
      setError(null);

      console.log('[useAuth] Updating profile with data (MOCKED):', JSON.stringify(data, null, 2));
      
      // MOCKADO: Atualizar apenas localmente
      const currentUser = contextUser;
      if (!currentUser) {
        return {
          success: false,
          error: 'Usuário não autenticado'
        };
      }

      const updatedUser = {
        ...currentUser,
        ...data,
        // Mesclar preferências se fornecidas
        ...(data.preferences && {
          preferences: {
            ...(currentUser.preferences || {}),
            ...data.preferences,
          }
        })
      };

      // Salvar no AsyncStorage
      await AsyncStorage.setItem('@wenda_user', JSON.stringify(updatedUser));
      setContextUser(updatedUser);
      
      console.log('[useAuth] Profile updated locally (MOCKED):', updatedUser);
      
      return { 
        success: true, 
        user: updatedUser 
      };

      // VERSÃO ORIGINAL (desabilitada):
      // const response = await authService.updateProfile(data);
      // console.log('[useAuth] Update profile response:', response);
      //
      // if (response.success && response.data) {
      //   await AsyncStorage.setItem('@wenda_user', JSON.stringify(response.data));
      //   setContextUser(response.data);
      //   return { success: true, user: response.data };
      // } else {
      //   const errorMessage = response.message || 'Erro ao atualizar perfil';
      //   setError(errorMessage);
      //   console.error('[useAuth] Update failed:', errorMessage);
      //   return { success: false, error: errorMessage };
      // }
    } catch (error: any) {
      const errorMessage = error.message || 'Erro ao atualizar perfil';
      setError(errorMessage);
      console.error('[useAuth] Update profile error (MOCKED):', error);
      console.error('[useAuth] Error status:', error.response?.status);
      return { 
        success: false, 
        error: errorMessage 
      };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      
      // Chamar endpoint de logout no backend (opcional, mas recomendado)
      try {
        await authService.logout();
      } catch (error) {
        // Continuar mesmo se o logout no backend falhar
        console.error('Backend logout error:', error);
      }
      
      // Limpar AsyncStorage
      await AsyncStorage.removeItem('@wenda_access_token');
      await AsyncStorage.removeItem('@wenda_user');
      
      setContextUser(null);
      setError(null);
      
      return { success: true };
    } catch (error) {
      console.error('Logout error:', error);
      return { success: false, error };
    } finally {
      setIsLoading(false);
    }
  };

  const refreshUser = async () => {
    try {
      const response = await authService.getProfile();
      
      if (response.success && response.data) {
        await AsyncStorage.setItem('@wenda_user', JSON.stringify(response.data));
        setContextUser(response.data);
        return { success: true, user: response.data };
      }
      
      return { success: false };
    } catch (error) {
      console.error('Refresh user error:', error);
      return { success: false, error };
    }
  };

  return {
    user: contextUser,
    isLoading,
    error,
    login,
    register,
    updateProfile,
    logout,
    refreshUser,
  };
}
