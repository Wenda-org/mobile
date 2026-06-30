import { useAuthStore } from '../stores/useAuthStore';
import { authService } from '../services/authService';
import { UserPreferences, User } from '../types/api.types';
import { useTranslation } from 'react-i18next';

export const useAuth = () => {
  const { t } = useTranslation();
  const {
    user,
    token,
    isLoading,
    error,
    setAuth,
    setUser,
    clearAuth,
    initializeAuth,
    setError,
    setLoading,
  } = useAuthStore();

  const login = async (credentials: Record<string, string>) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authService.login(credentials);
      if (response && response.accessToken && response.user) {
        await setAuth(response.user, response.accessToken);
        return { success: true };
      }
      throw new Error(t('auth.login_error') || 'Erro no login');
    } catch (e: any) {
      const msg = e.response?.data?.message || e.message || t('auth.login_error') || 'Erro no login';
      setError(msg);
      return { success: false, error: msg };
    } finally {
      setLoading(false);
    }
  };

  const register = async (data: Record<string, any>) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authService.register(data);
      if (response && response.accessToken && response.user) {
        await setAuth(response.user, response.accessToken);
        return { success: true };
      }
      throw new Error(t('auth.register_error') || 'Erro no registro');
    } catch (e: any) {
      const msg = e.response?.data?.message || e.message || t('auth.register_error') || 'Erro no registro';
      setError(msg);
      return { success: false, error: msg };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await authService.logout().catch(() => {}); // catch silent fail if already expired
    } finally {
      await clearAuth();
      setLoading(false);
    }
  };

  const updateProfile = async (data: Partial<User> & { preferences?: UserPreferences }) => {
    setLoading(true);
    setError(null);
    try {
      const updatedUser = await authService.updateProfile(data);
      await setUser(updatedUser);
      return { success: true, user: updatedUser };
    } catch (e: any) {
      const msg = e.response?.data?.message || e.message || 'Erro ao atualizar perfil';
      setError(msg);
      return { success: false, error: msg };
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    token,
    isLoading,
    error,
    isAuthenticated: !!token,
    login,
    register,
    logout,
    updateProfile,
    initializeAuth,
    setError,
  };
};
export default useAuth;
