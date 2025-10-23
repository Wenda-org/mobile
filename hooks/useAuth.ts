import * as SecureStore from 'expo-secure-store';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import { useState, useEffect } from 'react';

// Complete the browser session before starting auth
WebBrowser.maybeCompleteAuthSession();

// This hook manages authentication state
export function useAuth() {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Google OAuth configuration
  const [request, response, promptAsync] = Google.useAuthRequest({
    // TODO: Add your Google OAuth client IDs here
    // androidClientId: 'YOUR_ANDROID_CLIENT_ID',
    // iosClientId: 'YOUR_IOS_CLIENT_ID',
    // webClientId: 'YOUR_WEB_CLIENT_ID',
  });

  useEffect(() => {
    loadUser();
  }, []);

  useEffect(() => {
    if (response?.type === 'success') {
      const { authentication } = response;
      handleGoogleLogin(authentication);
    }
  }, [response]);

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

  const handleGoogleLogin = async (authentication: any) => {
    try {
      // TODO: Send token to your backend
      // const response = await axios.post('/api/auth/google', { token: authentication.accessToken });
      // const userData = response.data;
      
      console.log('Google authentication:', authentication);
      
      // Mock user data for now
      const userData = { email: 'google@user.com', id: '456', name: 'Google User' };
      
      await SecureStore.setItemAsync('user', JSON.stringify(userData));
      await SecureStore.setItemAsync('token', authentication.accessToken);
      setUser(userData);
    } catch (error) {
      console.error('Google login error:', error);
    }
  };

  const loginWithGoogle = async () => {
    await promptAsync();
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
