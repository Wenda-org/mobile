import * as SecureStore from 'expo-secure-store';
import { useState, useEffect } from 'react';

// This hook manages authentication state
export function useAuth() {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const userData = await SecureStore.getItemAsync('user');
      if (userData) {
        setUser(JSON.parse(userData));
      }
    } catch (error) {
      console.error('Error loading user:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      // TODO: Call your API endpoint
      // const response = await axios.post('/api/auth/login', { email, password });
      // const userData = response.data;

      // Mock user data for now
      const userData = { email, id: '123', name: 'User' };

      await SecureStore.setItemAsync('user', JSON.stringify(userData));
      await SecureStore.setItemAsync('token', 'mock-jwt-token');
      setUser(userData);
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error };
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      // TODO: Call your API endpoint
      // const response = await axios.post('/api/auth/register', { name, email, password });
      // const userData = response.data;

      // Mock user data for now
      const userData = { email, id: '123', name };

      await SecureStore.setItemAsync('user', JSON.stringify(userData));
      await SecureStore.setItemAsync('token', 'mock-jwt-token');
      setUser(userData);
      return { success: true };
    } catch (error) {
      console.error('Register error:', error);
      return { success: false, error };
    }
  };

  // Temporarily disabled Google login
  const loginWithGoogle = async () => {
    console.log('Google login temporarily disabled');
  };

  const logout = async () => {
    try {
      await SecureStore.deleteItemAsync('user');
      await SecureStore.deleteItemAsync('token');
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return {
    user,
    isLoading,
    login,
    register,
    loginWithGoogle,
    logout,
  };
}
